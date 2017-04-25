const Coder = require('./coder');
const { pn } = require('../def');
const { renderer } = require('../../dist/vpp');

function pack_renderer (files, ast, name) {
    function is_instance (nodeName) {
        return files.indexOf(nodeName) != -1;  
    }
    const coder = new Coder();
    coder.add_line('function ' + pn + name + '_r () {');
    coder.indent();
    coder.add_line('const { ', false);
    let count = 0;
    for (let i in renderer) {
        if (count > 0) {
            coder.add(', ');
            if (count % 3 == 0) {
                coder.add_newline();
                coder.add_line(i, false);
            } else {
                coder.add(i);
            }
        } else {
            coder.add(i);
            first = false;
        }
        count++;
    }
    coder.add(' } = ' + pn + 'renderer;');
    coder.add_newline();
    coder.add_line('return ', false);
    coder.add(ast.serialize(is_instance, coder._indent));
    coder.deindent();
    coder.add_newline();
    coder.add_line('}');
    return coder;
}

module.exports = pack_renderer;