//viewModel file extension
const vm_ext = '.v'
//model file extension
const m_ext = '.js'
//destination file extension
const dest_ext = '.js'

//preserved namespace
const pn = '_$_' 

//cache directory
const cache = 'vpp_cache'

//vpp version
const version = require('./package.json').version

//compile options
const production = require('process').env.NODE_ENV == 'production'

module.exports = { vm_ext, m_ext, dest_ext, pn, cache, version, production }