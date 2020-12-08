## CoreDI
[![codecov](https://codecov.io/gh/empla/coredi/branch/master/graph/badge.svg?token=X0QZUEJQ80)](https://codecov.io/gh/empla/coredi)
![Build and Test](https://github.com/empla/coredi/workflows/Build%20and%20Test/badge.svg)
![Dependabot](https://api.dependabot.com/badges/status?host=github&repo=empla/coredi)
![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/empla/coredi)
![GitHub](https://img.shields.io/github/license/empla/coredi)
![npm](https://img.shields.io/npm/dm/@empla/coredi)

Dependency Injection library for Node.jS and Browser

## Features

- Node.js and Browser support
- Well tested code
- Container fork support
- Recursive dependencies resolving support
- Service Groups support

## Installation

```bash
npm install @empla/coredi
```

## Usage

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

## Documentation

Visit [official site](https://coredi.js.org) for documentation

## How to build project

Install:

```bash
npm install
```

Test:
```bash
npm test
```

Lint code:
```bash
npm run lint
```

Browser tests:

```bash
npm run bundle
```

and open `browser-test.html` in your browser.

## License

CoreDI licensed under [MIT License](LICENSE)

## Maintainers

- [@malikzh](https://github.com/malikzh)

----
Copyright (c) 2020 EMPLA GROUP, LLC

*Made with ❤️*
