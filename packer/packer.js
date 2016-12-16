const vm_packer = require('./vm_packer.js')
const m_packer = require('./m_packer.js')
const deps_packer = require('./deps_packer.js')
const compile = require('../compile')
const fs = require('fs')

//convert include_list to deps and files
function convert (include_list) {
    let deps = [], files = []
    for (let i of include_list) {
        files.push(i.file)
        deps.push(i.filePath)
    }
    return [deps, files]
}

function packer () {

    const [include_list, ast] = compile(vm_path)
    const [deps, files] = convert(include_list)

    const d = deps_packer(files, deps)
    const vm = vm_packer(files, ast, file)
    const m = m_packer(m_path, file)
    return [d, m, vm].join('\n')
}

module.exports = packer