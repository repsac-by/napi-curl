'use strict';

function requireAddon(name) {
	try {
		return require('./build/Release/' + name);
	} catch (e) {
		if (process.env.NODE_ENV === 'production' || e.code !== 'MODULE_NOT_FOUND' )
			throw e;

		console.error(`Try require '${name}' in debug mode`);
		return require('./build/Debug/' + name);
	}
}

const { Curl: NapiCurl } = requireAddon('curl_client');
const Response = require('./response');
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
	 * @param  {string}   opts.post   - Data to send in an HTTP POST operation
	 * @param  {Readable} opts.put    - Uploading means using the PUT request
	 * @return {Promise<Response>}  Response that is called as soon as the header is received
	 */
	perform(opts = {}) {
		return new Promise( (resolveHeader, rejectHeader) => {

			const req = {};

			// PUT
			if (opts.put instanceof Readable) {
				this.setOpt('UPLOAD', 1);
				const src = opts.put
					.on('error', rejectHeader)
					.on('readable', () => this.resume());

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

			let headerResolved = false;
			const stream = new Readable({
				read: () => this.readStart(),
			});

			stream.on('error', () => this.cancel());

			req.onError = err => {
				rejectHeader(err);
				stream.destroy(err);
			};

			req.onHeader = rawHeaders => {
				headerResolved = true;
				resolveHeader(new Response(this, rawHeaders, stream));
			};

			req.onData = buf => {
				// We have to copy the data or it will be destroyed.
				stream.push(new Uint8Array(buf.slice(0))) || this.readStop();
			};

			req.onEnd = () => {
				if (headerResolved)
					return stream.push(null);
				req.onError(new Error('Connection closed without response'));
			};

			super.perform(req);
		});
	}
}

module.exports.Curl = Curl;
