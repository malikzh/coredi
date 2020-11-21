const _ = require('lodash');
const providerInstance = require('./provider-instance');
const serviceLoader = require('./service-loader');

/**
 * Merge two schemas
 * @param {Object} a Main schema
 * @param {Object} b Package schema
 * @return {Object}
 */
function mergeSchema(a, b) {
  const sc = _.cloneDeep(a);

  // merge loaders
  if (_.isArray(b.loaders)) {
    sc.loaders = _.unionBy(b.loaders, sc.loaders, 'name');
  }

  // config
  if (_.isObject(b.config)) {
    sc.config = sc.config || {};
    _.defaults(sc.config, b.config);
  }

  return sc;
}

/**
 * Create fork of current container
 *
 * @param {Object} schema Container schemd
 * @param {String} containerName Name of container
 * @return {Promise<Function>} Forked container
 */
module.exports = async function(schema, containerName) {
  const parentSchema = this.schema[this.containerName];

  const newSchema = {
    [containerName]: mergeSchema(
        mergeSchema(parentSchema, this.schema[containerName] || {}),
        schema || {}),
  };

  const instance = providerInstance();
  instance.containerName = containerName;
  instance.schema = newSchema;
  instance.services = {};
  instance.parent = this;
  instance.children = {};

  this.children[containerName] = instance;

  const dependencyStack = [];

  for (const loader of newSchema[containerName].loaders) {
    if (instance.services[loader.name]) {
      continue;
    }

    await serviceLoader(instance, loader.name, false, dependencyStack);
  }

  return instance;
};
