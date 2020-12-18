const _ = require('lodash');

/**
 * Recursive service loader
 *
 * @param {Object} container CoreDI main container
 * @param {String} serviceName Service name
 * @param {Boolean} forkMode Use fork function
 * @param {String[]} dependencyStack Dependencies stack
 * @return {Promise<void>}
 */
module.exports = async function loadService(container, serviceName,
    forkMode, dependencyStack) {
  if (!_.isFunction(container)) {
    throw new Error('Container argument must be a function');
  }

  if (!_.isString(serviceName) || serviceName.length < 1) {
    throw new Error('Invalid service name');
  }

  if (!_.isObject(container.schema) ||
    !_.isObject(container.schema[container.containerName]) ||
    !_.isArray(container.schema[container.containerName].loaders) ||
    !_.isObject(container.services)) {
    throw new Error('Invalid container given');
  }

  let serviceLoader = container.schema[container.containerName].loaders
      .find((s) => (!s.__esModule && s.name === serviceName) ||
        (s.__esModule && s.default.name === serviceName));

  if (!serviceLoader) {
    throw new Error('Cannot find service loader for service: ' + serviceName);
  }

  serviceLoader = (serviceLoader.__esModule ?
    serviceLoader.default : serviceLoader);

  if (!_.isObject(serviceLoader.config)) {
    serviceLoader.config = {};
  }

  // Check service creation function
  let createFuncName = 'create';

  if (forkMode && _.isFunction(serviceLoader['fork'])) {
    createFuncName = 'fork';
  }

  if (!_.isFunction(serviceLoader[createFuncName])) {
    throw new Error(
        'create() function not found in service loader: ' + serviceName);
  }

  if (_.isFunction(container.log)) {
    container.log('Loading service "' + serviceName + '" from application ' +
      '"' + container.containerName + '"...');
  }

  // Merge configuration
  if (_.isObject(container.schema[container.containerName].config) &&
    _.isObject(container.schema[container.containerName].config[serviceName])) {
    serviceLoader.config = _.defaultsDeep(
        container.schema[container.containerName].config[serviceName],
        serviceLoader.config);
    container.schema[container.containerName]
        .config[serviceName] = serviceLoader.config;
  }

  // Resolve dependencies
  if ((_.isArray(serviceLoader.requires) &&
    serviceLoader.requires.length > 0) ||
    (_.isString(serviceLoader.requires))) {
    const requires = (_.isString(serviceLoader.requires) ?
      [serviceLoader.requires] : serviceLoader.requires);

    for (const dependencyName of requires) {
      if (container.services[dependencyName]) {
        continue;
      }

      // Check for recursive dependency
      if (dependencyStack.indexOf(dependencyName) !== -1) {
        throw new Error(
            'Dependency recursion detected. On service "' + serviceLoader.name +
            '". Service requires "' + dependencyName + '" but that service ' +
            ' requires "' + serviceLoader.name + '"');
      }

      dependencyStack.push(dependencyName);
      await loadService(container, dependencyName, forkMode, dependencyStack);
      dependencyStack.pop();
    }
  }

  // Create service
  const service = await serviceLoader[createFuncName](container);
  container.services[serviceName] = (!_.isNil(service) ? service : null);
};
