const providerInstance = require('./provider-instance');
const serviceLoader = require('./service-loader');
const forkContainer = require('./fork');
const _ = require('lodash');

/**
 * Create coredi container
 *
 * @param {Object} schema Container schema
 * @param {String} containerName Name of current container
 * @param {Object} options Container options
 * @param {Function} logFunc Logger function
 * @return {Promise<Function>} CoreDI container
 */
module.exports = async function(schema, containerName, options, logFunc) {
  const instance = providerInstance();
  instance.containerName = containerName;
  instance.schema = schema;
  instance.services = {};
  instance.parent = null;
  instance.children = {};
  instance.options = options || {};
  instance.fork = forkContainer;
  instance.log = function() {};

  if (_.isFunction(logFunc)) {
    instance.log = logFunc;
  }

  const dependencyStack = [];

  const loaders = instance.schema[instance.containerName].loaders;

  for (const loader of loaders) {
    if (instance.services[loader.name]) {
      continue;
    }

    await serviceLoader(instance, loader.name, false, dependencyStack);
  }

  return instance;
};
