const Coder = require('./coder.js')

function convert (include_list) {
    let deps = [], paths = []
    for (let i of include_list) {
        deps.push(i.file)
        paths.push(i.filePath)
    }
    return [deps, paths]
}

function vm_packer (deps, ast, name) {
    function is_instance (file) {
        return deps.indexOf(file) != -1      
    }
    const coder = new Coder()
    coder.add_line('function ' + name + '_vm () {')
    coder.indent()
    coder.add_line('return ', false)
    coder.add(ast.serialize(is_instance, coder._indent) + ';')
    coder.deindent()
    coder.add_newline()
    coder.add_line('}', false)
    return coder.toString()
}

module.exports = function (include_list, ast, name) {
    let [deps, paths] = convert(include_list)
    return vm_packer(deps, ast, name)
}