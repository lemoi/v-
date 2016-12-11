const Coder = require('./coder.js')

function convert (include_list) {
    let deps = [], paths = []
    for (let i of include_list) {
        deps.push(i.file)
        paths.push(i.filePath)
    }
    return [deps, paths]
}

function vm_packer (deps, ast) {
    function is_dep (name) {
        return deps.indexOf(name) != -1      
    }
    const coder = new Coder()
    coder.add_line()
}

module.exports = function (include_list, ast) {
    let [deps, paths] = convert(include_list)
    return vm_packer(deps, ast)
}