import { promisify } from 'promise-callbacks';

export type Iterable<T> = {
  next: (p?: T) => Promise<T | void>;
};
type Iteratee<T> = (p: T) => Promise<T>;

async function promiseIterate(
  iterable: Iterable<any>,
  iteratee: Iteratee<any>,
  { batchSize }: { batchSize?: number } = {}
): Promise<void> {
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

async function asyncIterate(
  iterable: Iterable<any>,
  iteratee: Iteratee<any>,
  options: { batchSize?: number } = {}
): Promise<void> {
  return await promiseIterate(promisify.methods(iterable, ['next']), iteratee, options);
}

promiseIterate.asyncIterate = asyncIterate;
export default promiseIterate;
