promise-iterate
===============

Iteration over cursor-like objects with `async`/`await`.

Given a cursor-like object - one with an asynchronous `#next` method that returns a promise - and an
iteratee function, asynchronously iterates over the iterable.

Requires a version of Node that supports [`async`][async]/[`await`][await].

```js
const promiseIterate = require('promise-iterate');

async function sample() {
  const cursor = new Cursor();
  try {
    // cursor.next must return a Promise.
    await promiseIterate(cursor, async (doc) => {
      // do something with doc, asynchronously
    });
  } catch (err) {
    console.error(err, 'occurred while processing the cursor');
  }
}
```

```js
const { asyncIterate } = require('promise-iterate');

async function sample() {
  // callback-style async cursor, such as a mongodb cursor.
  const cursor = new AsyncCursor();
  try {
    // cursor.next must call a callback function.
    await asyncIterate(cursor, async (doc) => {
      // do something with doc, asynchronously
    });
  } catch (err) {
    console.error(err, 'occurred while processing the cursor');
  }
}
```

Install
-------

```sh
$ npm install promise-iterate
```

or

```sh
$ npm install promise-iterate
```

Changelog
---------

* 1.0.0 Adding typescript.

* 0.2.3 Fix loading on Node >= 7.6.0.

* 0.2.2 Fix package.json again so it can be published properly.

* 0.2.1 Fix package.json so it can be published properly.

* 0.2.0 Adds transpilation so it can be used in Node 6 (and prior) environments.

* 0.1.0 Initial release.

License
-------

> The MIT License (MIT)
>
> Copyright &copy; 2017 Mixmax, Inc ([mixmax.com](https://mixmax.com))
>
> Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
>
> The above copyright notice and this permission notice shall be included in allcopies or substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[async]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
[await]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await
