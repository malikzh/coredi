## Schemas

For container services describe, CoreDI use schema.

When you call:
```js
const coredi = require('@empla/coredi');

coredi(schema, containerName).then(function (container) {
    //...
});
```

`coredi` accepts in first argument schema definition, and
second argument is container name.

schemas look like this:

```js
{
    containerName: {
        loaders: [
            {
                name: 'serviceName',
                config: {
                    defaultParameter: 'defaultValue',
                },
                async create() {
                    return myService;
                }
            },
            {
                name: 'serviceName2',
                config: {
                    defaultParameter: 'defaultValue2',
                },
                async create() {
                    return myService2;
                }
            },
            // ...
        ],
        config: {
            myService: {
                defaultParameter: 'override'
            },
            myService2: {
                defaultParameter: 'override2'
                someParameter: '...',
            },
        }   
    }
}
``` 

### Schema properties

- `loaders` property contains a [service loaders](service-loaders.md).
- `config` property contains a config for service. Service name in service loader must be match with service name in config.

> Config in schema overrides config in service loader. For override we use lodash.defaultsDeep() function 
