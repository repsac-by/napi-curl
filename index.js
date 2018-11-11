'use strict';

const debuglog = require('util').debuglog('napi-curl');

function requireAddon(name){
	try {
		return require('./build/Release/' + name);
	} catch (e) {
		if ( e.code !== 'MODULE_NOT_FOUND' )
			throw e;

		debuglog(`Try require '${name}' in debug mode`);
		return require('./build/Debug/' + name);
	}
}

const { Curl: NapiCurl } = requireAddon('curl_client');
const { TextDecoder } = require('util');
const { parseHeaderLine } = require('./helpers');
const { Readable } = require('stream');

/** Class representing Curl handle **/
class Curl extends NapiCurl {

	/**
	 * Create instance of Curl handle with default easy options
	 * @param {Object.<string, number|boolean|string|string[]>} [defaults] - Default Curl easy options https://curl.haxx.se/libcurl/c/easy_setopt_options.html
	 */
	constructor(defaults) {
		super();
		this.defaults = Object.assign({}, defaults);
		this.reset();
	}

	/**
	 * Extract information from a curl handle
	 * https://curl.haxx.se/libcurl/c/easy_getinfo_options.html
	 * @param  {string} key - Option key without prefix CURLINFO_
	 * @return {number|string|string[]}
	 */
	getInfo(key) {
		if ( typeof key !== 'string')
			throw new TypeError("Curl#getInfo expect string");

		key = key.replace(/^CURLINFO_/, '');
		return super.getInfo(key);
	}

	/**
	 * Curl easy options
	 * https://curl.haxx.se/libcurl/c/easy_setopt_options.html
	 * @param {string|Object.<string, number|boolean|string|string[]>} key - Option key without prefix CURLOPT_ or object of key-value
	 * @param {number|boolean|string|string[]} [val] - Optional value use when key is string
	 * @return {Curl} This
	 */
	setOpt(key, val) {
		if ( typeof key === 'string' ) {
			key = key.replace(/^CURLOPT_/, '');

			if ( key === 'HTTPHEADER' && this.defaults[key] instanceof Array )
				val = this.defaults[key].concat(val);

			super.setOpt(key, val);
			return this;
		}

		if ( typeof key === 'object' && key !== null ) {
			Object.entries(key).forEach( ([key, val]) => this.setOpt(key, val) );
			return this;
		}

		throw new TypeError("Curl#setOpt key expected string or object");
	}

	/**
	 * Reset option to default
	 * @param {...*} pass - Pass options to setOpt
	 * @return {Curl} This
	 */
	reset(...options) {
		super.reset();
		const defaults = this.defaults;

		if ( typeof defaults === 'object' && defaults !== null )
			Object.entries(defaults)
				.forEach( ([key, val]) => super.setOpt(key.replace(/^CURLOPT_/, ''), val) );

		if (options.length)
			this.setOpt(...options);

		return this;
	}

	/**
	 * Request to cancel transfer
	 * @return {undefined}
	 */
	cancel() {
		super.cancel();
	}

	/**
	 * Perform request
	 * @param  {Object} [opts={}]
	 * @param  {string}   opts.dataAs - Data can be returned in two ways as a 'promise' or as a 'stream'
	 * @param  {string}   opts.post   - Data to send in an HTTP POST operation
	 * @param  {Readable} opts.put    - Uploading means using the PUT request
	 * @return {Promise}  Response that is called as soon as the header is received
	 */
	perform(opts = {}) {
		debuglog('perform');
		const self = this;
		return new Promise( (resolve, reject) => {

			const req = {};

			// PUT
			if (opts.put instanceof Readable) {
				this.setOpt('UPLOAD', 1);
				const src = opts.put
					.on('error', reject)
					.on('readable', () => {
						debuglog('put_readable');
						this.resume();
					});

				req.onRead = len => {
					const chunk = src.read(Math.min(len, src.readableLength));

					if ( chunk )
						return chunk.buffer;

					if (src._readableState.ended)
						return null;

					return new ArrayBuffer(0);
				};
			} else
			if ('put' in opts)
				throw new TypeError(`'put' must be stream Readable`);

			// POST
			if (typeof opts.post === 'string') {
				if ('put' in opts)
					throw (`Forbidden to use 'put' or 'post' at the same time`);
				this.setOpt('COPYPOSTFIELDS', opts.post);
			} else
			if ('post' in opts)
				throw new TypeError(`'post' must be a string`);

			switch (opts.dataAs || 'promise') {

			case 'promise': {
				const decoder = new TextDecoder('utf8');
				let isHeeader = false;

				const data = new Promise( (resolveBody, rejectBody) => {
					debuglog('body promise');
					let body = '';

					req.onError = err => {
						debuglog('onError');
						reject(err);
						rejectBody(err);
					};

					req.onData = buf => {
						debuglog('onData');
						body += decoder.decode(buf, { stream: true });
					};

					req.onEnd = () => {
						debuglog('onEnd');
						if (!isHeeader)
							return req.onError(new Error('Connection closed without response'));

						body += decoder.decode();
						resolveBody(body);
					};
				} );

				req.onHeader = rawHeaders => {
					debuglog('onHeader');
					isHeeader = true;
					const headers = rawHeaders.reduce(parseHeaderLine, {});

					resolve({
						rawHeaders,
						headers,
						data
					});
				};

				// Suppress internal error;
				data.catch(() => {});
				break;
			}

			case 'stream': {
				let isHeeader = false;
				const stream = new Readable({
					read() {
						self.readStart();
					},
					destroy() {
						debuglog('stream destroy');
					}
				});

				req.onError = err => {
					reject(err);
					stream.emit('error', err);
				};

				req.onHeader = rawHeaders => {
					isHeeader = true;
					const headers = rawHeaders.reduce(parseHeaderLine, {});

					resolve({
						rawHeaders,
						headers,
						data: stream,
					});
				};

				req.onData = buf => {
					if (stream.push(new Uint8Array(buf.slice(0))))
						return;

					self.readStop();
				};

				req.onEnd = () => {
					if (!isHeeader)
						return req.onError(new Error('Connection closed without response'));
					stream.push(null);
				};
				break;
			}
			default:
				throw new TypeError(`dataAs: expect 'promise' or 'stream'`);
			}

			super.perform(req);
		});
	}
}

module.exports.Curl = Curl;
