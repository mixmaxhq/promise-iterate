const promiseIter = require('..');
const expect = require('chai').expect;

describe('promiseIterate', function() {
  it('should iterate over a cursor', async function() {
    let value = 0;
    const cursor = {
      next: async () => value > 4 ? null : ++value
    };

    const values = [];
    await promiseIter(cursor, async (v) => {
      values.push(v);
      await new Promise((resolve) => setTimeout(resolve, 1));
    });

    expect(values).to.deep.equal([1, 2, 3, 4, 5]);
  });

  it('should iterate over an empty cursor', async function() {
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

    expect(calls).to.equal(1);
  });

  it('should pass along errors', async function() {
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

    expect(err).to.be.an.instanceof(Error).and.to.have.property('message', 'yay');
  });

  it('should batch the cursor', async function() {
    let value = 0;
    const cursor = {
      next: async() => value > 5 ? null : ++value
    };

    const values = [];
    await promiseIter(cursor, async (v) => {
      values.push(v);
    }, {batchSize: 2});

    expect(values).to.deep.equal([[1, 2], [3, 4], [5, 6]]);
  });

  it('should batch the cursor and handle the end correctly', async function() {
    let value = 0;
    const cursor = {
      next: async() => value > 4 ? null : ++value
    };

    const values = [];
    await promiseIter(cursor, async (v) => {
      values.push(v);
    }, {batchSize: 2});

    expect(values).to.deep.equal([[1, 2], [3, 4], [5]]);
  });
});

describe('asyncIterate', function() {
  it('should iterate over a cursor', async function() {
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

    expect(values).to.deep.equal([1, 2, 3, 4, 5]);
  });
});
