'use strict';

// https://nodejs.org/api/http.html#http_message_headers
const ignoreDuplicateOf = new Set([
	'age', 'authorization', 'content-length', 'content-type', 'etag',
	'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
	'last-modified', 'location', 'max-forwards', 'proxy-authorization',
	'referer', 'retry-after', 'user-agent'
]);

module.exports.parseHeaderLine = (acc, line) => {
	const [rawKey, val] = line.split(':', 2).map(v => v.trim());

	if (undefined === val)
		return acc;

	const key = rawKey.toLowerCase();

	if ( key in acc ) {
		if ( 'set-cookie' === key )
			acc[key].push(val);
		else if ( ! ignoreDuplicateOf.has(key) )
			acc[key] += ', ' + val;
	}
	else if ( 'set-cookie' === key )
		acc[key] = [ val ];
	else
		acc[key] = val;

	return acc;
};

module.exports.isJson = contentType => {
	return typeof contentType === 'string'
		&& contentType.toLowerCase().startsWith('application/json');
};
