const Coder = require('./coder.js')
const { pn } = require('../def.js')

function factory_pack (file) {
    let coder = new Coder()
    coder.add_line('export const '+ pn + file +'_f = factory_helper(' + file + ', ' + pn + file + '_vm);')
    return coder
}

module.exports = factory_pack