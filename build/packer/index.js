const vm_pack = require('./vm_pack');
const deps_pack = require('./deps_pack');
const factory_pack = require('./factory_pack');
const compile = require('../compile');
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const Coder = require('./coder');
const { cache, vm_ext, m_ext , dest_ext } = require('../def');
const { FileNotFound } = require('../error_static');
//convert include_list to files
function convert (include_list) {
    let files = [], deps = [];
    for (let i of include_list) {
        files.push(i.alias ===null ? i.file : i.alias);
        deps.push(i.filePath);
    }
    return [deps, files];
}

class Packer {
    constructor (dirname) {
        this._src_dir = dirname;
        this._dist_dir = path.join(dirname, cache);
    }

    pack (file, midpath = '.') {
        const src_dir = path.join(this._src_dir, midpath),
        dest_dir = path.join(this._dist_dir, midpath, '/'),
        vm_path = path.join(src_dir, file + vm_ext),
        m_path = path.join(src_dir, file + m_ext),
        dest_path = path.join(dest_dir, file + dest_ext),
        coder = new Coder();

        let m_exist = true;
        if (!fs.existsSync(vm_path)) throw FileNotFound(vm_path);
        if (!fs.existsSync(m_path)) m_exist = false;

        const vm_source = fs.readFileSync(vm_path, 'utf8'),
        m_source = m_exist && fs.readFileSync(m_path, 'utf8') || '',  
        [include_list, ast] = compile(vm_source, vm_path),
        [deps, files] = convert(include_list);

        if (!fs.existsSync(dest_dir))
            mkdirp.sync(dest_dir);
        coder.add_section(deps_pack(include_list));
        coder.add_newline();
        coder.add_section(m_source);
        coder.add_newline();
        coder.add_section(vm_pack(files, ast, file));
        coder.add_newline();
        coder.add_section(factory_pack(file, m_exist));
        fs.writeFileSync(dest_path, coder.toString());
        return deps;
    }

    pack_auto (entry) {
        let paths = [],pack = this.pack.bind(this);
        function pk(file, midpath) {
            let deps = pack(file, midpath);
            for (let dep of deps) {
                let p = path.join(midpath, dep);
                if (paths.indexOf(p) == -1) {
                    paths.push(p);
                    pk(path.basename(dep), path.join(midpath, path.dirname(dep)));
                }
            }
        }
        paths.push(entry);
        pk(entry, '.');
    }
}

module.exports = Packer;