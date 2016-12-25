const Coder = require('./coder');
const { dest_ext, pn, production } = require('../def');

const common = `import { vm as ${pn}vm, create_factory as ${pn}create_factory } from 'vpp';`;
function deps_pack (include_list) {
    const coder = new Coder();
    coder.add_line(common);
    if (!production)
        coder.add_line(`import { types as ${pn}types } from 'vpp';`);
    for (let i of include_list)
        coder.add_line('import { ' + pn + i.file + '_f as '+ pn + 
            (i.alias === null ? i.file : i.alias) 
            +' } from \'' + 
            i.filePath + '\';');
    return coder;
}

module.exports = deps_pack;