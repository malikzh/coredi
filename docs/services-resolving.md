## Service resolving

When you need get a service by name. You can run `container`
as a function. For example:

```js
container('myservice')
```

That means, _"Get me a service with name 'myservice''"_.

### Resolving with parameter

For convenience, we added "service name with parameter" possibility.

How it works? You can use it like this:

```js
container('myservice:param')
```

it's equals to:

```js
container('myservice')('param')
```

That very helpful, when you implement some services,
for example log service.

You can implement it like this:
```
container('log').log('warn', 'mymessage');
```

Or:

```js
container('log:warn').log('mymessage');
```

### Resolve service in another container

If you need get a service in another container
you can get it like this:

```js
container('myservice@mycontainer');
```

You can use with parameter:

```js
container('myservice@mycontainer:myparam');
```
