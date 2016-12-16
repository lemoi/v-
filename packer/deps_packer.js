const Coder = require('./coder.js')

function deps_packer (files, deps) {
    const coder = new Coder()
    for (let i in deps)
        coder.add_line('import ' + files[i] + ' from "' + deps[i] + '";')
    return coder.toString()
}

module.exports = deps_packer