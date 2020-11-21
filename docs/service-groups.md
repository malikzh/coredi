## Service Groups

You can create groups from services. For example,
we need to implement authentication service. But,
authentication can be with db, ldap and etc.

How implement it?

Easy. Use Service Groups.

When you describe container schema, you can
do it like this:

```js
const coredi = require('@empla/coredi');
const ServiceGroup = require('@empla/coredi/service-group');


coredi({
    app: {
        loaders: [
            {
                name: 'log',
                async create(c) {
                     // ...
                }
            },
            ServiceGroup('auth', [
                {
                    name: 'db',
                    async create(c) {
                        // ...
                    }   
                },
                {
                    name: 'ldap',
                    async create(c) {
                        // ...
                    }   
                },
            ]),
        ]
    }
}, 'app');
```

### Resolving service

```js
container('auth:ldap');
container('auth:db');
```

### Get services in group

```js
container('auth').services;
```
