## Getting started

CoreDI actively uses JS promises and `async/await`.

How install CoreDI:

```bash
npm install @empla/coredi
```

First, we need create a container from [schema](schemas.md).

```js
const coredi = require('@empla/coredi');

coredi({
    app: {
        loaders: [
            {
                name: 'myservice',
                config: {
                    param: 'defaultValue'
                },
                async create(container) {
                    return myServiceObject;
                },
            },
        ],
    },
}, 'app').then(function(container) {
    const myservice = container('myservice');  
    // ...
});
```
