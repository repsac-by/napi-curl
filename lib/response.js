'use strict';

const { Readable } = require('node:stream');
const { parseHeaderLine } = require('./helpers');

const kGetInfo = Symbol('kGetInfo');
const kHeaders = Symbol('kHeaders');
const kTrailers = Symbol('kTrailers');
const kStatusText = Symbol('kTrailers');

/** @typedef {typeof import("./curlinfo.js").curlinfo } curlinfo */

module.exports = class Response extends Readable {
	/**
	 * @param {Function} getInfo
	 * @param {Object} opts
	 */
	constructor ({ getInfo, read }) {
		super({ read });
		this[kGetInfo] = getInfo;
		this[kHeaders] = [];
		this[kTrailers] = [];
		this[kStatusText] = '';
	}

	/**
	 * Headers associated with the response
	 * @type {Object}
	 */
	get headers () {
		return this[kHeaders];
	}

	set headers (value) {
		this[kHeaders] = value.slice(1).reduce(parseHeaderLine, Object.create(null));
	}

	/**
	 * Extract information from a curl handle
	 * https://curl.haxx.se/libcurl/c/easy_getinfo_options.html
	 * @param  {curlinfo} key - Option key without prefix CURLINFO
	 * @return {number|string|string[]}
	 */
	getInfo (key) {
		return this[kGetInfo](key);
	}

	/**
	 * Trailers associated with the response
	 * @type {Object}
	 */
	get trailers () {
		return this[kTrailers];
	}

	set trailers (value) {
		this[kTrailers] = value.reduce(parseHeaderLine, Object.create(null));
	}

	/**
	 * Contains the URL of the response
	 * @type {string}
	 */
	get url () {
		return this[kGetInfo]('EFFECTIVE_URL');
	}

	/**
	 * Status code of the response
	 * @type {number}
	 */
	get status () {
		return this[kGetInfo]('RESPONSE_CODE');
	}

	/**
	 * The status message corresponding to the status code
	 * @type {string}
	 */
	get statusText () {
		const headers = this[kHeaders];
		const match = /^HTTP\/\d\.\d\s+\d{3}\s+(.*)$/.exec(headers[0]);
		const value = null !== match ? match[1] : '';
		Object.defineProperty(this, 'statusText', { value, enumerable: true, writable: false });
		return value;
	}

	/**
	 * The response was successful (status in the range 200-299) or not
	 * @type {boolean}
	 */
	get ok () {
		const { status } = this;
		return 200 <= status && status < 300;
	}

	/**
	 * The total number of redirections that were actually followed
	 * @type {number}
	 */
	get redirected () {
		return this[kGetInfo]('REDIRECT_COUNT');
	}

	/**
	 * A promise that resolves with a string ArrayBuffer
	 * @returns {Promise<ArrayBuffer>}
	 */
	arrayBuffer () {
		return new Promise( (resolve, reject) => {
			const acc = [];
			let totalLength = 0;

			super.setEncoding('utf8')
				.on('data', buf => {
					totalLength += buf.length;
					acc.push(buf);
				})
				.once('error', reject)
				.once('end', () => {
					const data = new Uint8Array(totalLength);
					let offset = 0;

					for (const a of acc) {
						data.set(a, offset);
						offset += a.length;
					}

					resolve(data.buffer);
				});
		});
	}

	/**
	 * A promise that resolves with the result of parsing the body text as JSON
	 * @returns {Promise<Object>}
	 */
	json () {
		return this.text().then(JSON.parse);
	}

	/**
	 * A promise that resolves with a string
	 * @returns {Promise<string>}
	 */
	text () {
		return new Promise( (resolve, reject) => {
			let text = '';
			super.setEncoding('utf8')
				.on('data', buf => { text += buf })
				.once('error', reject)
				.once('end', () => resolve(text));
		});
	}

	/**
	 * Old behavior
	 * @type {Promise<string>}
	 */
	get data () {
		return this.text();
	}
};
