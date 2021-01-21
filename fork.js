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
    sc.loaders = _.unionBy(b.loaders, sc.loaders,
        (v) => v.__esModule ? v.default.name : v.name);
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
 * @param {Object} options Container options
 * @return {Promise<Function>} Forked container
 */
module.exports = async function(schema, containerName, options) {
  const parentSchema = this.schema[this.containerName];

  const newSchema = {
    [containerName]: mergeSchema(
        mergeSchema(parentSchema, this.schema[containerName] || {}),
        schema || {}),
  };

  options = options || {};

  _.defaultsDeep(options, this.options);

  const instance = providerInstance();
  instance.containerName = containerName;
  instance.schema = newSchema;
  instance.services = {};
  instance.parent = this;
  instance.children = {};
  instance.options = options;
  instance.log = this.log;

  this.children[containerName] = instance;

  const dependencyStack = [];

  for (let loader of newSchema[containerName].loaders) {
    if (loader.__esModule) {
      loader = loader.default;
    }

    if (instance.services[loader.name] ||
      instance.services[loader.name] === null) {
      continue;
    }

    await serviceLoader(instance, loader.name, true, dependencyStack);
  }

  return instance;
};
