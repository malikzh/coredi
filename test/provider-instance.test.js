const assert = require('assert');
const sinon = require('sinon');

const providerInstance = require('../provider-instance');

describe('Provider instance test', function() {
  it('test not match', function() {
    const prov = providerInstance();
    assert.strictEqual(prov('#@$&'), null);
  });

  it('test return service', function() {
    const testf = {a: 'b'};

    const prov = providerInstance();
    prov.services = {
      mytest: testf,
    };

    assert.strictEqual(prov('mytest'), testf);
  });

  it('test return service', function() {
    const prov = providerInstance();
    prov.services = {};

    assert.strictEqual(prov('mytest'), null);
  });

  it('test return with scope', function() {
    const srv1 = {a: 1};
    const srv2 = {a: 2};

    const prov = providerInstance();
    prov.parent = {
      children: {
        'another-scope': {
          services: {
            testsrv: srv2,
          },
        },
      },
    };
    prov.services = {
      testsrv: srv1,
    };

    assert.strictEqual(prov('testsrv'), srv1);
    assert.strictEqual(prov('testsrv@another-scope'), srv2);
  });

  it('test without parent', function() {
    const prov = providerInstance();
    prov.services = {
      mytest: {},
    };

    assert.strictEqual(prov('mytest@package'), null);
  });

  it('test return service', function() {
    const prov = providerInstance();
    const serviceCall = sinon.spy();

    prov.services = {
      withparam: function(param) {
        assert.strictEqual(param, 'param1');
        serviceCall();
        return 'test123';
      },
    };

    assert.strictEqual(prov('withparam:param1'), 'test123');
    assert.ok(serviceCall.calledOnce);
  });
});
