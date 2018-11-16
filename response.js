'use strict';

const { parseHeaderLine } = require('./helpers');

module.exports = class Response {
	/**
	 * @param {Curl} curl
	 * @param {string[]} rawHeaders
	 * @param {Readable} body
	 */
	constructor(curl, rawHeaders, body) {
		this.curl = curl;
		this.rawHeaders = rawHeaders;

		/**
		 * @type {Readable}
		 */
		this.body = body;
	}

	/**
	 * Headers associated with the response
	 * @type {Object}
	 */
	get headers () {
		const value = this.rawHeaders.slice(1).reduce(parseHeaderLine, Object.create(null));
		Object.defineProperty(this, 'headers', { value, enumerable: true, writable: false });
		return value;
	}

	/**
	 * Contains the URL of the response
	 * @type {string}
	 */
	get url() {
		return this.curl.getInfo('EFFECTIVE_URL');
	}

	/**
	 * Status code of the response
	 * @type {number}
	 */
	get status () {
		return this.curl.getInfo('RESPONSE_CODE');
	}

	/**
	 * The status message corresponding to the status code
	 * @type {string}
	 */
	get statusText () {
		const match = /^HTTP\/\d\.\d\s+\d{3}\s+(.*)$/.exec(this.rawHeaders[0]);
		const value = null !== match ? match[1] : '';
		Object.defineProperty(this, 'statusText', { value, enumerable: true, writable: false });
		return value;
	}

	/**
	 * The response was successful (status in the range 200-299) or not
	 * @type {boolean}
	 */
	get ok() {
		const status = this.status;
		return 200 <= status && status < 300;
	}

	/**
	 * The total number of redirections that were actually followed
	 * @type {number}
	 */
	get redirected() {
		return this.curl.getInfo('REDIRECT_COUNT');
	}

	/**
	 * A promise that resolves with a string ArrayBuffer
	 * @returns {Promise<ArrayBuffer>}
	 */
	arrayBuffer() {
		return new Promise( (resolve, reject) => {
			const acc = [];
			let totalLength = 0;

			this.body.setEncoding('utf8')
				.on('error', reject)
				.on('data', buf => {
					totalLength += buf.length;
					acc.push(buf);
				})
				.on('end', () => {
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
	json() {
		return this.text().then(JSON.parse);
	}

	/**
	 * A promise that resolves with a string
	 * @returns {Promise<string>}
	 */
	text() {
		return new Promise( (resolve, reject) => {
			let text = '';
			this.body.setEncoding('utf8')
				.on('error', reject)
				.on('data', buf => text += buf)
				.on('end', () => resolve(text));
		});
	}

	/**
	 * Old behavior
	 * @type {Promise<string>}
	 */
	get data() {
		return this.text();
	}
};
