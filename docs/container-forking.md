## Container forking

When we develop our application sometimes we need
module system. CoreDI provides _Container Forking_.

How it works?

In main application we create a container. We do it as usual.

```js
coredi(schema, name).then(f);
```

But... When we load a module for application we can **fork**
current container and load config in package. For example:

```js
// Our module loader
container.fork(schema, name).then(function(container) {
    // Load module
    const module = require('ourmodule');
    
    // Pass container to our module
    module(container);
});
```
