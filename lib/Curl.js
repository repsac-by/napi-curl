'use strict';

const { requireAddon } = require('./helpers');
const { Curl: NapiCurl } = requireAddon('curl_client');
const Response = require('./response');
const { Readable } = require('stream');
const constants = require('./constants');

/** @typedef { import("./curlopt.js").Curlopt } Curlopt */
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
	 * @param  {curlinfo} key - Option key without prefix CURLINFO
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
	 * @param {Curlopt|string} key - Option key without prefix CURLOPT_ or object of key-value
	 * @param {number|boolean|string|string[]} [val] - Optional value use when key is string
	 * @return {Curl} This
	 */
	setOpt (key, val) {
		if ( typeof key === 'string' ) {
			key = key.replace(/^CURLOPT_/, '');

			if ( key === 'HTTPHEADER' && this.defaults[key] instanceof Array )
				val = this.defaults[key].concat(val);

			super.setOpt(key, val);
			return this;
		}

		if ( typeof key === 'object' && key !== null ) {
			Object.entries(key).forEach( ([ key, val ]) => this.setOpt(key, val) );
			return this;
		}

		throw new TypeError('Curl#setOpt key expected string or object');
	}

	/**
	 * Reset option to default
	 * @param {...*} pass - Pass options to setOpt
	 * @return {Curl} This
	 */
	reset (...options) {
		super.reset();
		this.resetDefaults();

		if (options.length)
			this.setOpt(...options);

		return this;
	}

	/**
	 * Request to cancel transfer
	 * @return {undefined}
	 */
	cancel () {
		super.cancel();
	}

	/**
	 * These mechanisms usually send some traffic on existing connections in order to keep them alive
 	* @return {undefined}
 	*/
	upkeep () {
		super.upkeep();
	}

	then (resolve, reject) {
		return this.perform().then(resolve, reject);
	}

	/**
	 * Get request
	 * @param {string|URL} url
	 * @return {Promise<Response>}
	 */
	get (url) {
		this.setOpt({ URL: String(url) });
		return {
			then: (resolve, reject) => this.perform().then(resolve, reject),
			json: () => this.json(),
			text: () => this.text(),
		};
	}

	/**
	 * Post request
	 * @param {string|URL} url
	 * @param {string} data
	 * @return {Promise<Response>}
	 */
	post (url, data) {
		if (data) {
			this.setOpt({ URL: String(url) });
		} else {
			data = url;
		}

		return {
			then: (resolve, reject) => this.perform({ post: data }).then(resolve, reject),
			json: () => this.perform({ post: data }).then(resp => resp.json()),
			text: () => this.perform({ post: data }).then(resp => resp.text()),
		};
	}

	/**
	 * Put request
	 * @param {string|URL} url
	 * @param {Readable} stream
	 * @param {Object} [curlopts]
	 * @return {Promise<Response>}
	 */
	put (url, stream) {
		this.setOpt({ URL: String(url) });
		return {
			then: (resolve, reject) => this.perform({ put: stream }).then(resolve, reject),
			json: () => this.perform({ put: stream }).then(resp => resp.json()),
			text: () => this.perform({ put: stream }).then(resp => resp.text()),
		};
	}

	text () {
		return this.perform().then(resp => resp.text());
	}

	json () {
		return this.perform().then(resp => resp.json());
	}

	/**
	 * Perform request
	 * @param  {Object} [opts={}]
	 * @param  {string}   opts.post   - Data to send in an HTTP POST operation
	 * @param  {Readable} opts.put    - Uploading means using the PUT request
	 * @return {Promise<Response>}  Response that is called as soon as the header is received
	 */
	perform (opts = {}) {
		return new Promise( (resolve, reject) => {

			// PUT
			if (opts.put instanceof Readable) {
				this.setOpt('UPLOAD', 1);
				const src = opts.put
					.once('error', reject)
					.on('readable', () => this.resume());

				super.onRead = len => {
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

			const response = new Response({
				getInfo: this.getInfo.bind(this),
				read: () => super.readStart(),
			});

			response.once('error', () => super.cancel());

			super.onHeader = headers => {
				super.onHeader = trailers => { response.trailers = trailers };
				response.headers = headers;
				resolve(response);
			};

			super.onError = err => { reject(err); response.destroy(err) };
			super.onData = buf => { response.push(new Uint8Array(buf.slice(0))) || this.readStop() };
			super.onEnd = () => { response.push(null) };

			super.perform();
		});
	}
}

module.exports.Curl = Curl;
