import { describe } from 'ava-spec';
import promiseIter from '..';

describe('promiseIterate', (it) => {
  it('should iterate over a cursor', async (t) => {
    let value = 0;
    const cursor = {
      next: async () => value > 4 ? null : ++value
    };

    const values = [];
    await promiseIter(cursor, async (v) => {
      values.push(v);
      await new Promise((resolve) => setTimeout(resolve, 1));
    });

    t.deepEqual(values, [1, 2, 3, 4, 5]);
  });

  it('should iterate over an empty cursor', async (t) => {
    let calls = 0;
    const cursor = {
      next: async() => {
        ++calls;
        return null;
      }
    };

    await promiseIter(cursor, async (v) => {
      throw new Error('unexpected invocation');
    });

    t.is(calls, 1);
  });

  it('should pass along errors', async (t) => {
    const cursor = {
      next: async() => 'value'
    };

    let err;
    try {
      await promiseIter(cursor, async (v) => {
        throw new Error('yay');
      });
    } catch (e) {
      err = e;
    }

    t.truthy(err instanceof Error);
    t.is(err.message, 'yay');
  });

  it('should batch the cursor', async (t) => {
    let value = 0;
    const cursor = {
      next: async() => value > 5 ? null : ++value
    };

    const values = [];
    await promiseIter(cursor, async (v) => {
      values.push(v);
    }, {batchSize: 2});

    t.deepEqual(values, [[1, 2], [3, 4], [5, 6]]);
  });

  it('should batch the cursor and handle the end correctly', async (t) => {
    let value = 0;
    const cursor = {
      next: async() => value > 4 ? null : ++value
    };

    const values = [];
    await promiseIter(cursor, async (v) => {
      values.push(v);
    }, {batchSize: 2});

    t.deepEqual(values, [[1, 2], [3, 4], [5]]);
  });
});

describe('asyncIterate', (it) => {
  it('should iterate over a cursor', async (t) => {
    let value = 0;
    const cursor = {
      next: (done) => {
        process.nextTick(done, null, value > 4 ? null : ++value)
      }
    };

    const values = [];
    await promiseIter.asyncIterate(cursor, async (v) => {
      values.push(v);
    });

    t.deepEqual(values, [1, 2, 3, 4, 5]);
  });
});
