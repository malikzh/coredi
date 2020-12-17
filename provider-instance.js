module.exports = function() {
  return function Instance(serviceName, ...args) {
    const serviceMatch =
      /^([a-z0-9_\/@]+?)(?:@([a-z0-9_\-]+))?(?::([a-z0-9_.]+))?$/i;

    const matched = serviceName.match(serviceMatch);

    if (!matched) {
      return null;
    }

    const name = matched[1];
    const scope = matched[2];
    const param = matched[3];

    let services = Instance.services;

    if (scope) {
      if (!Instance.parent) {
        if (scope !== Instance.containerName) {
          return null;
        }
      } else {
        if (scope === Instance.parent.containerName) {
          services = Instance.parent.services;
        } else if (Instance.parent.children[scope]) {
          services = Instance.parent.children[scope].services;
        } else {
          return null;
        }
      }
    }

    if (!services[name]) {
      return null;
    }

    if (!param) {
      if (args.length < 1) {
        return services[name];
      } else {
        return services[name](...args);
      }
    }

    return services[name](param, ...args);
  };
};
