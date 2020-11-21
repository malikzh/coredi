const browserify = require('browserify');
const fs = require('fs');

browserify()
    .add('./test/coredi.test.js')
    .add('./test/fork.test.js')
    .add('./test/provider-instance.test.js')
    .add('./test/service-group.test.js')
    .add('./test/service-loader.test.js')
    .transform('babelify', {presets: ['@babel/preset-env']})
    .plugin('proxyquire-universal')
    .bundle()
    .pipe(fs.createWriteStream('bundle.js'));
