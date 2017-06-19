const { promisify } = require('promise-callbacks');

async function promiseIterate(iterable, iteratee, {batchSize} = {}) {
  for (;;) {
    let value;
    if (typeof batchSize === 'number' && batchSize >= 1) {
      value = new Array(batchSize);
      for (let i = 0; i < batchSize; ++i) {
        const next = await iterable.next();
        if (!next) {
          // If we haven't received any values from the iterable, then just finish iteration.
          if (i === 0) return;

          // If we have received values from the iterable, and we're under the batch size, but we
          // didn't receive a value from the iterable, then truncate the array.
          value.length = i;
          break;
        }
        value[i] = next;
      }
    } else {
      value = await iterable.next();
      // If we didn't receive a values from the iterable, then just finish iteration.
      if (!value) return;
    }
    await iteratee(value);
  }
}

async function asyncIterate(iterable, iteratee, options = {}) {
  return promiseIterate(promisify.methods(iterable, ['next']), iteratee, options);
}

promiseIterate.asyncIterate = asyncIterate;

module.exports = promiseIterate;
