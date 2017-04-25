module.exports = {
//renderer file extension
    rdr_ext: '.v',
//class file extension
    cls_ext: '.js',
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
