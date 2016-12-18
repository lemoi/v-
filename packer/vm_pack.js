const Coder = require('./coder.js')
const { pn } = require('../def.js')

function vm_pack (files, ast, name) {
    function is_instance (nodeName) {
        return files.indexOf(nodeName) != -1      
    }
    const coder = new Coder()
    coder.add_line('function ' + pn + name + '_vm () {')
    coder.indent()
    coder.add_line('return ', false)
    coder.add(ast.serialize(is_instance, coder._indent) + ';')
    coder.deindent()
    coder.add_newline()
    coder.add_line('}')
    return coder
}

module.exports = vm_pack