const vm_packer = require('./vm_packer.js')
const compile = require('../compile')

function pack (file) {
    const [include_list, ast] = compile(file)
    return vm_packer(include_list, ast, 'sample')
}

module.exports = pack