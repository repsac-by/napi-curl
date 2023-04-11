'use strict';

const { STATUS_CODES } = require('node:http');
const { Readable } = require('node:stream');
const { requireAddon } = require('./helpers');
const { Curl: NapiCurl } = requireAddon('curl_client');
const constants = require('./constants');

const CURL_MAX_INPUT_LENGTH = 8000000;

/** @typedef {import("./curlopt.js").Curlopt} Curlopt */
/** @typedef {import("./curlinfo.js").Curlinfo } Curlinfo */
/** @typedef {typeof import("./curlinfo.js").curlinfo } curlinfo */

/** @type {(h: string) => [string, string]} */
const hsplit = h => {
	const f = h.split(/:\s*(.*)$/, 2);
	return [f[0], f[1]];
};

/** Class representing Curl handle **/
class Curl extends NapiCurl {

	/**
	 * Create instance of Curl handle with default easy options
	 * @param {Curlopt} defaults - Default Curl easy options https://curl.haxx.se/libcurl/c/easy_setopt_options.html
	 */
	constructor (defaults = {}) {
		super();
		this.defaults = { ...defaults };
		this.resetDefaults();
		this.queue = Promise.resolve();
	}

	static get constants () {
		return constants;
	}

	/**
	 * @param {{ signal?: AbortSignal }} opts
	 * @returns {Promise<() => void>}
	 */
	async lock ({ signal } = {}) {
		signal?.throwIfAborted();

		/** @type {(value: any) => void} */
		let unlock;
		let prev = this.queue;
		this.queue = new Promise(resolve => unlock = resolve);

		await new Promise((resolve, reject) => {

			if (signal) {
				const abortHandler = (/** @type {any} */ reason) => { reject(reason); prev.then(unlock) };
				signal.addEventListener('abort', abortHandler);
				prev = prev.then(() => signal.removeEventListener('abort', abortHandler));
			}

			prev.then(resolve);
		});

		//@ts-ignore
		return unlock;
	}

	resetDefaults () {
		const { defaults } = this;
		if (typeof defaults === 'object' && defaults !== null) {
			Object.entries(defaults)
				.forEach(([ key, val ]) => super.setOpt(key.replace(/^CURLOPT_/, ''), val));
		}
	}

	/**
	 * Extract information from a curl handle
	 * https://curl.haxx.se/libcurl/c/easy_getinfo_options.html
	 * @param  {Curlinfo|curlinfo} key - Option key without prefix CURLINFO
	 * @return {number|string|string[]}
	 */
	getInfo (key) {
		if ( typeof key !== 'string')
			throw new TypeError('Curl#getInfo expect string');

		return super.getInfo(key.replace(/^CURLINFO_/, ''));
	}

	/**
	 * Curl easy options
	 * https://curl.haxx.se/libcurl/c/easy_setopt_options.html
	 * @param {Curlopt} options - Option key without prefix CURLOPT_ or object of key-value
	 * @return {Curl} This
	 */
	setOpt (options) {
		const { defaults } = this;
		Object.entries(options).forEach( ([ key, val ]) => {
			key = key.replace(/^CURLOPT_/, '');

			if (key === 'HTTPHEADER') {
				if (!Array.isArray(val))
					throw new TypeError('HTTPHEADER must be string[]');
				const headers = defaults[key];
				val = Array.isArray(headers) ? [ ...headers, ...val ] : val;
			}

			super.setOpt(key, val);
		});
		return this;
	}

	/**
	 * Reset option to default
	 * @param {Curlopt} [options] - Pass options to setOpt
	 * @return {Curl} This
	 */
	reset (options) {
		super.reset();
		this.resetDefaults();
		if (options)
			this.setOpt(options);
		return this;
	}

	/**
	 * These mechanisms usually send some traffic on existing connections in order to keep them alive
 	* @return {void}
 	*/
	upkeep () {
		super.upkeep();
	}

	// * @param { Iterable | AsyncIterable; } [opts.post] - Data to send in an HTTP POST operation
	// 	* @param { Iterable | AsyncIterable; } [opts.put] - Uploading means using the PUT request
	// 		* @param { AbortSignal; } [opts.signal]
	// 			* @param { Curlopt; } [opts.options]

	/**
	 * Perform request
	 * @param {{
	 *  method?: 'GET' | string,
	 * 	body?: Iterable<Uint8Array>|AsyncIterable<Uint8Array>|string|Uint8Array,
	 *  signal?: AbortSignal,
	 * } & Curlopt } opts
	 * @return { Promise<Response>}  Response that is called as soon as the header is received
	 */
	async perform ({ body, signal, ...options } = {}) {
		super.onClose = await this.lock({ signal });

		this.setOpt(options);

		return new Promise( (resolve, reject) => {
			if (typeof body === 'string') {
				body = new TextEncoder().encode(body);
			}

			if (body instanceof Uint8Array && body.byteLength <= CURL_MAX_INPUT_LENGTH) {
				this.setOpt({ POSTFIELDS: body });
			} else
			if (body) {
				/** @type {Readable} */
				let stream;
				if (body && (Symbol.iterator in body || Symbol.asyncIterator in body)) {
					stream = Readable.from(body, { objectMode: false, signal });
				} else {
					throw new TypeError( `body must be Iterable or AsyncIterable` );
				}

				const resume = () => setImmediate(() => super.resume());

				stream.once('end', resume);
				stream.once('error', err => { reject(err); super.cancel() });

				super.onRead = (/** @type {number} */ len) => {
					if (stream.readableLength) {
						const chunk = stream.read(Math.min(len, stream.readableLength));
						return new Uint8Array(chunk.buffer, chunk.byteOffset, chunk.length);
					}

					if (stream.readableEnded) {
						return null;
					}

					stream.once('readable', resume);
					return new Uint8Array(0);
				};
			}

			super.onError = reject;
			super.onHeaders = (/**@type {string[]}*/[ statusLine, ...headers ]) => {
				let [ , _status, statusText ] = /^HTTP\/\d[.\d]*\s+(\d{3})\s*(.*?)\s*$/.exec(statusLine) ?? [];

				const status = Number(_status ?? this.getInfo('RESPONSE_CODE'));

				if (100 <= status && status < 200) return;

				try {
					const response = new Response(
						new ReadableStream({
							start: controller => {
								super.onEnd = () => controller.close();
								super.onError = (/** @type {Error} */ err) => controller.error(err);
								super.onData = (/** @type {ArrayBuffer} */ buf) => {
									controller.enqueue(new Uint8Array(buf.slice(0)));
									if ((controller.desiredSize ?? 0) < 0) super.readStop();
								};
							},
							pull: () => super.readStart(),
							cancel: () => super.cancel(),
						}),
						{
							status,
							statusText: statusText ?? STATUS_CODES[status],
							headers: headers.map(hsplit).filter(v => v.length !== 2),
						},
					);

					resolve(response);

					super.onHeaders = (/** @type {string[]} */ headers) => {
						Object.defineProperty(response, 'trailers', {
							enumerable: true,
							value: new Headers(headers.map(hsplit).filter(v => v.length !== 2)),
						});
					};
				} catch (err) {
					reject(err);
					throw err;
				}
			};

			if (signal) signal.addEventListener('abort', () => super.cancel(), { once: true });
			super.perform();
		});
	}

	/**
	 * @param {string|URL} url
	 * @param {{
	 *    signal?: AbortSignal;
	 * } & Curlopt } opts
	 */
	get (url, { signal, ...options } = {}) {
		return this.perform({ URL: url.toString(), HTTPGET: 1, signal, ...options });
	}

	/**
	 * @param {string|URL} url
	 * @param {{
	 *    signal?: AbortSignal;
	 * } & Curlopt } opts
	 */
	head (url, { signal, ...options } = {}) {
		return this.perform({ URL: url.toString(), NOBODY: 1, signal, ...options });
	}

	/**
	 * @param {string|URL} url
	 * @param {{
	 *    signal?: AbortSignal;
	 * } & Curlopt } opts
	 */
	delete (url, { signal, ...options } = {}) {
		return this.perform({ URL: url.toString(), CUSTOMREQUEST: 'DELETE', signal, ...options });
	}

	/**
	 * @param {string|URL} url
	 * @param {{
	 *    body?: Iterable<any> | AsyncIterable<any>;
	 *    signal?: AbortSignal;
	 * } & Curlopt } opts
	 */
	post (url, { body, signal, ...options } = {}) {
		return this.perform({ URL: url.toString(), POST: 1, body: body ?? '', signal, ...options });
	}

	/**
	 * @param {string|URL} url
	 * @param {{
	 *    body?: Iterable<any>|AsyncIterable<any>;
	 *    signal?: AbortSignal;
	 * } & Curlopt } opts
	 */
	put (url, { body, signal, ...options } = {}) {
		return this.perform({ URL: url.toString(), UPLOAD: 1, CUSTOMREQUEST: 'PUT', body: body ?? '', signal, ...options });
	}
}

module.exports.Curl = Curl;
