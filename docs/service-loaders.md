## Service loaders

If you need create new service, you need create _service loader_.

> Service loader is simple js object, which contains information
> about dependencies for this service, default configuration, name,
> create and fork functions

Service loader:

```js
{
    name: 'serviceName',
    requires: ['someService'],
    config: {
        param: 'value',
    }
    async create(container) {
        const someService = container('someService');
    }
}
```

### Service loader definition

- `name` - service name. It uses for resolve service by name
- `requires` - string|array. List of services which must be loaded before load this service.
- `create(container)` - create service function. Function must be return a Promise with service object. This function accept one argument `container`, which contains container instance.
