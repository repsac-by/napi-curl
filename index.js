'use strict';

function requireAddon(name){
	try {
		return require('./build/Debug/' + name);
	} catch (ex) {
		return require('./build/Release/' + name);
	}
}

const DEBUG = 0;
const DBG_LOG = DEBUG
	? (fmt, ...args) => console.error("DEBUG JS: " + fmt, ...args)
	: () => {};

const { Curl } = requireAddon('addon');
const { TextDecoder } = require('util');
const { parseHeaderLine } = require('./helpers');
const { Readable } = require('stream');

module.exports.Curl = class extends Curl {
	constructor(defaults) {
		super();
		this.defaults = Object.assign({}, defaults);
		this.setOpt(this.defaults);
	}

	getInfo(key) {
		if ( typeof key !== 'string')
			throw new TypeError("Curl#getInfo expect string");

		key = key.replace(/^CURLINFO_/, '');
		return super.getInfo(key);
	}

	setOpt(key = {}, val = null) {
		if ( typeof key === 'string' ) {
			key = key.replace(/^CURLOPT_/, '');
			super.setOpt(key, val);
			return this;
		}

		if ( typeof key === 'object' ) {
			Object.entries(key).forEach( ([key, val]) => super.setOpt(key.replace(/^CURLOPT_/, ''), val) );
			return this;
		}

		throw new TypeError("Curl#setOpt key expected string or object");
	}

	reset() {
		super.reset();
		return this.setOpt(this.defaults);
	}

	perform(opts = {}) {
		const self = this;
		return new Promise( (resolve, reject) => {

			const req = {};

			// PUT
			if (opts.put instanceof Readable) {
				this.setOpt('UPLOAD', 1);
				const src = opts.put
					.on('error', reject)
					.on('readable', () => {
						DBG_LOG('readable');
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
				let rawHeaders = [];
				let headers = {};

				const data = new Promise( (resolve, reject_) => {
					let body = '';

					req.onError = err => {
						reject(err);
						reject_(err);
					};

					req.onData = buf => {
						body += decoder.decode(buf, { stream: true });
					};

					req.onEnd = () => {
						body += decoder.decode();
						resolve(body);
					};

				} );

				req.onHeader = lines => {
					rawHeaders = lines;
					headers = lines.reduce(parseHeaderLine, {});

					resolve({
						rawHeaders,
						headers,
						data
					});
				};

				break;
			}

			case 'stream': {
				const stream = new Readable({
					read() {
						self.readStart();
					},
					destroy() {
						DBG_LOG("destroy");
					}
				});

				req.onError = err => {
					reject(err);
					stream.emit('error', err);
				};

				req.onHeader = rawHeaders => {
					const headers = rawHeaders.reduce(parseHeaderLine, {});

					resolve({
						rawHeaders,
						headers,
						data: stream,
					});
				};

				req.onData = buf => {
					if ( stream.push(new Uint8Array(buf.slice(0))) )
						return;

					self.readStop();
				};

				req.onEnd = () => {
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
