const assert = require('assert');
const sinon = require('sinon');

const loadService = require('../service-loader');

if (!assert.rejects) {
  assert.rejects = async function(func) {
    let rejected = false;

    try {
      await func();
    } catch (e) {
      rejected = true;
    }

    assert.ok(rejected);
  };
}

describe('Service loader test', function() {
  let sandbox;

  beforeEach(function() {
    sandbox = sinon.createSandbox();
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('Invalid container object', async function() {
    await assert.rejects(loadService(null, null, null, null), {
      message: 'Container argument must be a function',
    });

    await assert.rejects(loadService(function() {}, null, null, null), {
      message: 'Invalid service name',
    });

    await assert.rejects(loadService(function() {}, 'test', null, null), {
      message: 'Invalid container given',
    });

    const f1 = function() {};
    f1.schema = {};

    await assert.rejects(loadService(f1, 'test', null, null), {
      message: 'Invalid container given',
    });

    const f2 = function() {};
    f2.schema = {
      testContainer: {
        loaders: {},
      },
    };
    f2.containerName = 'testContainer';

    await assert.rejects(loadService(f2, 'test', null, null), {
      message: 'Invalid container given',
    });

    const f3 = function() {};
    f3.schema = {
      testContainer: {
        loaders: [],
      },
    };
    f3.containerName = 'testContainer';

    await assert.rejects(loadService(f3, 'test', null, null), {
      message: 'Invalid container given',
    });
  });

  it('Invalid service loader object', async function() {
    const container = function() {};
    container.schema = {
      test123: {
        loaders: [
          {
            name: 'testx',
          },
          {
            name: 'testy',
            async fork() {},
          },
        ],
      },
    };

    container.services = {};
    container.containerName = 'test123';

    await assert.rejects(loadService(container, 'invalid', null, null), {
      message: 'Cannot find service loader for service: invalid',
    });

    await assert.rejects(loadService(container, 'testx', null, null), {
      message: 'create() function not found in service loader: testx',
    });

    await assert.rejects(loadService(container, 'testx', true, null), {
      message: 'create() function not found in service loader: testx',
    });
  });

  it('Test configuration merge', async function() {
    const container = function() {};
    container.schema = {
      test123: {
        loaders: [
          {
            name: 'testx',
            config: {
              param1: 'abc',
              param2: 'cde',
            },
            async create() {},
          },
        ],
        config: {
          testx: {
            param1: 'fff',
            param3: 'fgh',
          },
        },
      },
    };

    container.services = {};
    container.containerName = 'test123';

    await loadService(container, 'testx', false, null);

    assert.deepStrictEqual(container.schema.test123.loaders[0].config, {
      param1: 'fff',
      param2: 'cde',
      param3: 'fgh',
    });
  });

  it('Dependency resolver test', async function() {
    const container = function() {};
    container.schema = {
      test123: {
        loaders: [
          {
            name: 'testx',
            requires: 'testy',
            async create() {},
          },
          {
            name: 'testy',
            requires: 'testx',
            async create() {},
          },
          {
            name: 'testz',
            requires: ['testa', 'testb'],
            async create() {
              return {};
            },
          },
          {
            name: 'testa',
            async create() {
              return {};
            },
          },
        ],
      },
    };

    container.services = {
      testb: {},
    };
    container.containerName = 'test123';

    let depStack = [];

    await assert.rejects(loadService(container, 'testx', false, depStack), {
      message: 'Dependency recursion detected. On service "testx". ' +
        'Service requires "testy" but that service  requires "testx"',
    });

    depStack = [];

    await loadService(container, 'testz', false, depStack);

    assert.strictEqual(depStack.length, 0);
    assert.ok(container.services.testz);
    assert.ok(container.services.testa);
    assert.ok(container.services.testb);
  });
});
