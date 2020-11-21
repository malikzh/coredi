const _ = require('lodash');

/**
 * Create service group
 *
 * @param {String} groupName Service group name
 * @param {Object[]} loaders Loaders array
 * @return {Object}
 */
module.exports = function(groupName, loaders) {
  let requires = [];

  loaders.forEach((loader) => {
    requires.push(loader.requires || []);
  });

  requires = requires.map((item) => _.isArray(item) ? item : [item]);


  return {
    requires: _.union(...requires),
    name: groupName,
    async create(container, useFork) {
      const service = function svc(serviceName) {
        return svc.services[serviceName];
      };

      service.services = {};

      for (const loader of loaders) {
        loader.config = _.defaultsDeep(this.config[loader.name] || {},
            loader.config);

        if (useFork && _.isFunction(loader.fork)) {
          service.services[loader.name] = await loader.fork(container);
        } else {
          service.services[loader.name] = await loader.create(container);
        }
      }

      return service;
    },
    async fork(container) {
      return this.create(container, true);
    },
  };
};
