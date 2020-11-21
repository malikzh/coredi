const assert = require('assert');
const sinon = require('sinon');
const proxyquire = require('proxyquire').noPreserveCache().noCallThru();

describe('Coredi Builder test', async function() {
  let sandbox;

  beforeEach(function() {
    sandbox = sinon.createSandbox();
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe('Provider with scopes', async function() {
    it('Test with scopes', async function() {
      const service = {
        a: 'b',
      };

      const serviceLoaderSpy = sandbox.spy();

      const providerBuilder = proxyquire('../coredi', {
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

      const schema = {
        test123: {
          loaders: [
            {
              name: 'rrr',
            },
            {
              name: 'rtt',
            },
            service,
          ],
          config: {
            f: 'x',
            b: 'c',
          },
        },
      };

      await providerBuilder(schema, 'test123');
      assert.ok(serviceLoaderSpy.calledTwice);
    });
  });
});
