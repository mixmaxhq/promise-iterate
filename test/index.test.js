const promiseIter = require('..');

describe('promiseIterate', () => {
  it('should iterate over a cursor', async () => {
    let value = 0;
    const cursor = {
      next: async () => (value > 4 ? null : ++value),
    };

    const values = [];
    await promiseIter(cursor, async (v) => {
      values.push(v);
      await new Promise((resolve) => setTimeout(resolve, 1));
    });

    expect(values).toEqual([1, 2, 3, 4, 5]);
  });

  it('should iterate over an empty cursor', async () => {
    let calls = 0;
    const cursor = {
      async next() {
        ++calls;
        return null;
      },
    };

    await promiseIter(cursor, async () => {
      throw new Error('unexpected invocation');
    });

    expect(calls).toBe(1);
  });

  it('should pass along errors', async () => {
    const cursor = {
      next: async () => 'value',
    };

    let err;
    try {
      await promiseIter(cursor, async () => {
        throw new Error('yay');
      });
    } catch (e) {
      err = e;
    }

    expect(err instanceof Error).toBeTruthy();
    expect(err.message).toEqual('yay');
  });

  it('should batch the cursor', async () => {
    let value = 0;
    const cursor = {
      next: async () => (value > 5 ? null : ++value),
    };

    const values = [];
    await promiseIter(
      cursor,
      async (v) => {
        values.push(v);
      },
      { batchSize: 2 }
    );

    expect(values).toEqual([
      [1, 2],
      [3, 4],
      [5, 6],
    ]);
  });

  it('should batch the cursor and handle the end correctly', async () => {
    let value = 0;
    const cursor = {
      next: async () => (value > 4 ? null : ++value),
    };

    const values = [];
    await promiseIter(
      cursor,
      async (v) => {
        values.push(v);
      },
      { batchSize: 2 }
    );

    expect(values).toEqual([[1, 2], [3, 4], [5]]);
  });
});

describe('asyncIterate', () => {
  it('should iterate over a cursor', async () => {
    let value = 0;
    const cursor = {
      next(done) {
        process.nextTick(done, null, value > 4 ? null : ++value);
      },
    };

    const values = [];
    await promiseIter.asyncIterate(cursor, async (v) => {
      values.push(v);
    });

    expect(values).toEqual([1, 2, 3, 4, 5]);
  });
});
