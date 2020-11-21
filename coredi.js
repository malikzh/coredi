const providerInstance = require('./provider-instance');
const serviceLoader = require('./service-loader');
const forkContainer = require('./fork');

/**
 * Create coredi container
 *
 * @param {Object} schema Container schema
 * @param {String} containerName Name of current container
 * @return {Promise<Function>} CoreDI container
 */
module.exports = async function(schema, containerName) {
  const instance = providerInstance();
  instance.containerName = containerName;
  instance.schema = schema;
  instance.services = {};
  instance.parent = null;
  instance.children = {};
  instance.fork = forkContainer;

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
