const ServiceGroup = require('../service-group');
const assert = require('assert');

describe('Service groups test', async function() {
  it('requires test', async function() {
    const group = ServiceGroup('testx', [
      {
        name: 'test1',
        requires: 'svc1',
        config: {
          param1: 'z',
        },
        async create(container) {
          assert.strictEqual(this.config.param1, 'a');
          return 'test1x';
        },
        async fork(container) {
          return 'test2x';
        },
      },
      {
        name: 'test2',
        requires: ['svc2', 'svc3'],
        async create(container) {
          return 'test3x';
        },
      }
    ]);

    group.config = {
      test1: {
        param1: 'a',
        param2: 'b',
      },
      test2: {
        param1: 'x',
        param2: 'y',
      },
    };

    const svc = await group.create({});
    const forked = await group.fork({});

    assert.deepStrictEqual(group.requires, ['svc1', 'svc2', 'svc3']);
    assert.strictEqual(svc('test1'), 'test1x');
  });
});
