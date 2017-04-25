const Coder = require('./coder');
const { pn } = require('../def');

function pack_factory (file, m_exist) {
    let coder = new Coder(), 
    f = pn + file;
    coder.add_line(`export var ${f}_f = ${pn}combine(${f}_r${m_exist ? ', ' + file : ''});`);
    return coder;
}

module.exports = pack_factory;