const babel = require('rollup-plugin-babel')
const rollup = require('rollup')
rollup.rollup({
  entry: './vpp_cache/showcases.js',
  external: ['vpp'],
  paths: {
    //moment: 'https://d3js.org/d3.v4.min.js'
  },
  plugins: []
}).then(function (bundle) {
    bundle.write({
    format: 'es',
    dest: 'bundle.js'
    });
})