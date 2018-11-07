
Description
===========

A [node.js](http://nodejs.org/) binding to [libcurl](https://curl.haxx.se/libcurl/c/).

Requirements
============

* [node.js](http://nodejs.org/) -- v10.0.0 or newer

Examples
========

Create Curl instance with default options:

```javascript
const { Curl } = require('napi-curl');

const curl = new Curl({ USERAGENT: 'napi-curl' })
```

* Receive data as Promise:

```javascript

curl
	.setOpt({
		URL: 'http://example.com'
		'HTTPHEADER', [
			'Connection: keep-alive'
		]
	 })
	.perform()
	.then(res => {
		console.log(res.headers);
		return res.data   // This is a promise
	})
	.then(console.log)
```

* Receive data as Stream:

```javascript

curl
	.setOpt({
		URL: 'http://example.com'
		'HTTPHEADER', [
			'Connection: keep-alive'
		]
	 })
	.perform({ dataAs: 'stream' })
	.then(res => new Promise( (resolve, reject) => {
		console.log(res.headers);
		return res.data
			.on('error', reject)
			.on('end', resolve)
			.pipe(process.stdout);
	}))
	.then( () => console.log('end') )
	.catch( console.error )

```

Send POST data:
```javascript

curl
	.setOpt({ URL: 'http://example.com/form-data' })
	.perform({ post: 'This is post data' })
	.then(res => {
		console.log(res.headers);
		return res.data   // This is a promise
	})
	.then(console.log)
```

API
===

`require('napi-curl').Curl` returns a **_Client_** object

Client methods
--------------

* **constructor**(< _Object_ >) - Creates a new instance.

* **perform**() : _Promise_< _Response_ > - Attempts a connection to a server using the information given in `config`:

* **setOpt**(< _string_ >CURLOPT, < _mixed_ >values): _Curl_

Client static methods
---------------------

* **version**() - _string_ - Returns a string containing the libmariadbclient version number.
