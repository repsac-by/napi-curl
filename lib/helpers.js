'use strict';
/* @typedef {ErrorConstructor & { code: string }} Error */

/**
 * @param {string} name
 * @return {any}
 */
module.exports.requireAddon = name => {
	try {
		return require('../build/Release/' + name);
	} catch (e) {
		/** @type {NodeJS.ErrnoException} */
		const error = e instanceof Error ? e : new Error(String(e));
		if (process.env.NODE_ENV === 'production' || error.code !== 'MODULE_NOT_FOUND' ) {
			throw error;
		}

		console.error(`Try require '${name}' in debug mode`);
		return require('../build/Debug/' + name);
	}
};
