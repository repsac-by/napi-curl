'use strict';

const { Readable } = require('node:stream');
const { ReadableStream } = require('node:stream/web');
const { requireAddon } = require('./helpers');
const { Curl: NapiCurl } = requireAddon('curl_client');
const constants = require('./constants');

/** @typedef {import("./curlopt.js").Curlopt} Curlopt */
/** @typedef {typeof import("./curlinfo.js").curlinfo } curlinfo */

/** Class representing Curl handle **/
class Curl extends NapiCurl {

	/**
	 * Create instance of Curl handle with default easy options
	 * @param {Curlopt} [defaults] - Default Curl easy options https://curl.haxx.se/libcurl/c/easy_setopt_options.html
	 */
	constructor (defaults) {
		super();
		this.defaults = { ...defaults };
		this.resetDefaults();
	}

	static get constants () {
		return constants;
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
	 * @param  {curlinfo|string} key - Option key without prefix CURLINFO
	 * @return {number|string|string[]}
	 */
	getInfo (key) {
		if ( typeof key !== 'string')
			throw new TypeError('Curl#getInfo expect string');

		key = key.replace(/^CURLINFO_/, '');
		return super.getInfo(key);
	}

	/**
	 * Curl easy options
	 * https://curl.haxx.se/libcurl/c/easy_setopt_options.html
	 * @param {Curlopt|string|Record<string, any>} key - Option key without prefix CURLOPT_ or object of key-value
	 * @param {number|bigint|boolean|string|string[]|ArrayBuffer} [val] - Optional value use when key is string
	 * @return {Curl} This
	 */
	setOpt (key, val) {
		if ( typeof key === 'string' ) {
			key = key.replace(/^CURLOPT_/, '');

			if ( key === 'HTTPHEADER' && this.defaults[key] instanceof Array ) {
				// @ts-ignore
				val = this.defaults[key].concat(val);
			}

			super.setOpt(key, val);
			return this;
		}

		if ( key && typeof key === 'object' ) {
			Object.entries(key).forEach( ([ key, val ]) => this.setOpt(key, val) );
			return this;
		}

		throw new TypeError('Curl#setOpt key expected string or object');
	}

	/**
	 * Reset option to default
	 * @param {any[]} options - Pass options to setOpt
	 * @return {Curl} This
	 */
	reset (...options) {
		super.reset();
		this.resetDefaults();

		if (options.length) {
			// @ts-ignore
			this.setOpt(...options);
		}

		return this;
	}

	/**
	 * These mechanisms usually send some traffic on existing connections in order to keep them alive
 	* @return {void}
 	*/
	upkeep () {
		super.upkeep();
	}

	/**
	 * Perform request
	 * @param {Object} [opts]
	 * @param {Iterable|AsyncIterable} [opts.post] - Data to send in an HTTP POST operation
	 * @param {Iterable|AsyncIterable} [opts.put]  - Uploading means using the PUT request
	 * @param {AbortSignal} [opts.signal]
	 * @return {Promise<Response>}  Response that is called as soon as the header is received
	 */
	perform ({ post, put, signal } = {}) {
		return new Promise( (resolve, reject) => {
			if (post && put)
				throw Error(`Forbidden to use 'put' and 'post' at the same time`);

			signal?.throwIfAborted();

			if (typeof post === 'string') {
				this.setOpt({ POSTFIELDSIZE_LARGE: post.length });
				this.setOpt({ COPYPOSTFIELDS: post });
			} else
			if (post || put) {
				const body = post ?? put;

				/** @type {Readable} */
				let stream;
				if ( body && (body[Symbol.iterator] || body[Symbol.asyncIterator])) {
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

				if (post) {
					super.setOpt('POST', 1);
				} else
				if (put) {
					super.setOpt('UPLOAD', 1);
				}
			}

			const body = new ReadableStream({
				start: controller => {
					super.onEnd = () => controller.close();
					super.onError = (/** @type {Error} */ err) => { controller.error(err); reject(err) };
					super.onData = (/** @type {ArrayBuffer} */ buf) => {
						controller.enqueue( new Uint8Array( buf.slice(0) ) );
						if ((controller.desiredSize ?? 0) < 0) super.readStop();
					};
				},
				pull: () => super.readStart(),
				cancel: () => super.cancel(),
			}, { highWaterMark: 8192 });


			super.onHeaders = ([ statusLine, ...headers ]) => {
				const [ , status, statusText ] = /^HTTP\/\d\.\d\s+(\d{3})\s+(.*)$/.exec(statusLine) ?? [];

				if (status === '100') return;

				const hsplit = h => h.split(/:\s*(.*)$/, 2);

				const response = new Response(body, {
					status: Number(status),
					statusText,
					headers: headers.map(hsplit),
				});

				super.onHeaders = headers => {
					Object.defineProperty(response, 'trailers', {
						enumerable: true,
						value: new Headers(headers.map(hsplit)),
					});
				};

				resolve(response);
			};

			signal?.addEventListener('abort', () => super.cancel() );
			super.perform();
		});

	}

	/**
	 * @param {string|URL} url
	 * @param {object} [opts]
	 * @param {AbortSignal} [opts.signal]
	 */
	get (url, { signal } = {}) {
		return this.setOpt({ URL: url.toString() }).perform({ signal });
	}

	/**
	 * @param {string|URL} url
	 * @param {object} [opts]
	 * @param {Iterable|AsyncIterable} [opts.body]
	 * @param {AbortSignal} [opts.signal]
	 */
	post (url, { body, signal } = {}) {
		return this.setOpt({ URL: url.toString() }).perform({ post: body, signal });
	}

}

module.exports.Curl = Curl;
