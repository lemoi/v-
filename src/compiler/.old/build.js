const babel = require('rollup-plugin-babel');
const rollup = require('rollup')
rollup.rollup({
  entry: '../src/vpp.js',
  treeshake: false
}).then(function (bundle) {
    bundle.write({
    format: 'umd',
    dest: '../dist/vpp.js',
    moduleName: 'vpp'
    });
})