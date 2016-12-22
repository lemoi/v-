module.exports = {
//viewModel file extension
    vm_ext: '.v',
//model file extension
    m_ext: '.js',
//destination file extension
    dest_ext: '.js',

//preserved namespace
    pn: '_v_',

//cache directory
    cache: 'vpp_cache',

//vpp version
    version: require('../package.json').version,

//compile options
    production: process.env.NODE_ENV == 'production'
}
