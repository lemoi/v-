const Coder = require('./coder');
const { pn } = require('../def');

function factory_pack (file, m_exist) {
    let coder = new Coder(), 
    f = pn + file;
    coder.add_line(`export var ${f}_f = ${pn}create_factory(${f}_vm${m_exist ? ', ' + file : ''})`);
    return coder;
}

module.exports = factory_pack;