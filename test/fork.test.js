const assert = require('assert');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

proxyquire.noPreserveCache && proxyquire.noPreserveCache();
proxyquire.noCallThru && proxyquire.noCallThru();

describe('Coredi Builder test', async function() {
  let sandbox;

  beforeEach(function() {
    sandbox = sinon.createSandbox();
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe('Provider with parent', async function() {
    it('test with parent no scope with config', async function() {
      const ParentProvider = {
        containerName: 'testcc',
        schema: {
          testcc: {
            loaders: [{a: 'b'}],
            config: {
              param1: 'qwe',
              param2: 'rty',
            },
          },
          testr: {
            loaders: [
              {
                name: 'rrr',
              },
              {
                name: 'rtt',
              },
              {
                name: 'xxx',
              },
            ],
            config: {
              param1: 'uio',
              param3: 'rtc',
            },
          },
        },
        children: {},
      };

      const serviceLoaderSpy = sandbox.spy();

      ParentProvider.fork = proxyquire('../fork', {
        './provider-instance': function() {
          return function() {};
        },
        './service-loader': async function(provider) {
          provider.services = {
            rtt: {},
          };
          serviceLoaderSpy();
        },
      });

      const provider = await ParentProvider.fork({
        config: {
          param3: 'qqc',
          param4: 'tmnv',
        },
        loaders: [
          {
            name: 'test32x',
          },
        ],
      }, 'testr');

      assert.strictEqual(provider.schema.testr.config.param1, 'qwe');
    });
  });
});
