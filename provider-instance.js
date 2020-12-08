module.exports = function() {
  return function Instance(serviceName) {
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
      if (!Instance.parent || !Instance.parent.children[scope]) {
        return null;
      }

      services = Instance.parent.children[scope].services;
    }

    if (!services[name]) {
      return null;
    }

    if (!param) {
      return services[name];
    }

    return services[name](param);
  };
};
