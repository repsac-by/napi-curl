
# napi-curl

A high-performance [node.js](http://nodejs.org/) binding to [libcurl](https://curl.haxx.se/libcurl/c/).

## Requirements

* [node.js](http://nodejs.org/) — v10.0.0 or newer

## Quick Start

### Basic GET request
The simplest way to fetch data is using the `get` method, which returns a `Promise` that resolves to a `Response` object.

```javascript
const { Curl } = require('napi-curl');

const curl = new Curl();

curl.get('http://example.com')
  .then(res => {
    console.log('Status:', res.status);
    console.log('Headers:', res.headers);
    return res.data; // res.data is a Promise resolving to Uint8Array
  })
  .then(data => {
    console.log('Body:', new TextDecoder().decode(data));
  })
  .catch(console.error);
```

### Streaming Response
To handle large responses without loading them entirely into memory, use the `dataAs: 'stream'` option.

```javascript
const { Curl } = require('napi-curl');

const curl = new Curl();

curl.setOpt({ URL: 'http://example.com' })
  .perform({ dataAs: 'stream' })
  .then(res => {
    console.log('Headers:', res.headers);
    return new Promise((resolve, reject) => {
      res.data
        .on('error', reject)
        .on('end', resolve)
        .pipe(process.stdout);
    });
  })
  .then(() => console.log('\nStream finished'))
  .catch(console.error);
```

### POST Request with Body
You can send data in a POST request using the `post` convenience method or by passing a `body` to `perform`.

```javascript
const { Curl } = require('napi-curl');

const curl = new Curl();

// Simple string body
curl.post('http://example.com/form', {
  body: 'name=jdoe&age=30'
}).then(res => res.data.then(console.log));

// Using an AsyncIterable (e.g., for large uploads)
async function* getLargeData() {
  yield new Uint8Array([1, 2, 3]);
  yield new Uint8Array([4, 5, 6]);
}

curl.post('http://example.com/upload', {
  body: getLargeData()
}).then(res => res.data.then(console.log));
```

## API Reference

### `Curl` Class
The main interface for interacting with libcurl.

#### Methods

* **`constructor(defaults)`**
  Creates a new `Curl` instance.
  * `@param {Curlopt} defaults` — Default options applied to every request made with this instance.

* **`setOpt(options)`**
  Sets curl options.
  * `@param {Curlopt} options` — An object where keys are option names (without `CURLOPT_` prefix) and values are the settings.
  * Returns: `this` (for chaining).
  * *Note: `HTTPHEADER` values are merged with existing default headers.*

* **`perform(opts)`**
  Executes the request.
  * `@param {{ 
      method?: string, 
      body?: Iterable<Uint8Array>|AsyncIterable<Uint8Array>|string|Uint8Array, 
      signal?: AbortSignal, 
      ...options: Curlopt 
    }} opts`
  * Returns: `Promise<Response>` — Resolves as soon as headers are received.

* **`get(url, opts)`** / **`post(url, opts)`** / **`put(url, opts)`** / **`head(url, opts)`** / **`delete(url, opts)`**
  Convenience methods for common HTTP verbs.
  * `@param {string|URL} url`
  * `@param {Curlopt & { signal?: AbortSignal }} opts`

* **`getInfo(key)`**
  Retrieves information about the last transfer.
  * `@param {Curlinfo|string} key` — The info key (without `CURLINFO_` prefix).
  * Returns: `number | string | string[]`.

* **`reset(options)`**
  Resets the handle to its default state and optionally applies new options.

* **`upkeep()`**
  Sends traffic on existing connections to keep them alive.

* **`lock({ signal })`**
  Provides concurrency control, ensuring requests on this handle are executed sequentially.
  * `@param {{ signal?: AbortSignal }} opts`
  * Returns: `Promise<() => void>` — A function to unlock the handle.

#### Static Methods

* **`version()`**
  Returns a string containing the `libcurl` version number.

---

### `Response` Object
Returned by `perform()` or convenience methods.

* **`status`**: `number` — The HTTP status code.
* **`statusText`**: `string` — The HTTP status text.
* **`headers`**: `Headers` — An object containing the response headers.
* **`trailers`**: `Headers` — Access to HTTP trailers (if available).
* **`data`**: `Promise<Uint8Array> | ReadableStream` — The response body. 
  * If `dataAs: 'stream'` was used in `perform`, this is a `ReadableStream`.
  * Otherwise, it is a `Promise` that resolves to a `Uint8Array`.

---

### Constants

* **`curlopt`**: An object containing all valid `CURLOPT_` keys for use in `setOpt` and `constructor`.
* **`curlinfo`**: An object containing all valid `CURLINFO_` keys for use in `getInfo`.

## Advanced Usage

### Canceling a Request with `AbortSignal`

```javascript
const { Curl } = require('napi-curl');

const curl = new Curl();
const controller = new AbortController();

curl.get('http://example.com', { signal: controller.signal })
  .catch(err => {
    if (err.name === 'AbortError') {
      console.log('Request was canceled');
    } else {
      console.error('Request failed', err);
    }
  });

// Cancel the request after 100ms
setTimeout(() => controller.abort(), 100);
```

### Connection Keep-Alive

To maintain a pool of connections and avoid repeated handshakes, use `upkeep()` periodically.

```javascript
const { Curl } = require('napi-curl');

const curl = new Curl();

async function run() {
  for (let i = 0; i < 10; i++) {
    await curl.get('http://example.com').then(res => res.data);
    // Keep connection alive
    await curl.upkeep();
  }
}

run().catch(console.error);
```

