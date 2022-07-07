'use strict';

// https://nodejs.org/api/http.html#http_message_headers
const ignoreDuplicateOf = new Set([
	'age', 'authorization', 'content-length', 'content-type', 'etag',
	'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
	'last-modified', 'location', 'max-forwards', 'proxy-authorization',
	'referer', 'retry-after', 'user-agent',
]);

module.exports.parseHeaderLine = (acc, line) => {
	const pair = /^([^:]*):(.*)$/.exec(line);
	if (null === pair)
		return acc;

	const key = pair[1].trim().toLowerCase();
	const val = pair[2].trim();

	if ( key in acc ) {
		if ( 'set-cookie' === key )
			acc[key].push(val);
		else if ( !ignoreDuplicateOf.has(key) )
			acc[key] += ', ' + val;
	}
	else if ( 'set-cookie' === key )
		acc[key] = [ val ];
	else
		acc[key] = val;

	return acc;
};

/**
 * @param {string} name
 * @returns {object}
 */
module.exports.requireAddon = name => {
	try {
		return require('../build/Release/' + name);
	} catch (e) {
		if (process.env.NODE_ENV === 'production' || e.code !== 'MODULE_NOT_FOUND' )
			throw e;

		console.error(`Try require '${name}' in debug mode`);
		return require('../build/Debug/' + name);
	}
};

module.exports.isJson = contentType => typeof contentType === 'string'
		&& contentType.toLowerCase().startsWith('application/json');
