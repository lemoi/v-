const Coder = require('./coder.js')
const { dest_ext, pn } = require('../def.js')

function deps_pack (include_list) {
    const coder = new Coder()
    for (let i of include_list)
        coder.add_line('import { ' + pn + i.file + '_f as '+ pn + 
            (i.alias === null ? i.file : i.alias) 
            +' } from "' + 
            i.filePath + dest_ext + '";')
    return coder
}

module.exports = deps_pack