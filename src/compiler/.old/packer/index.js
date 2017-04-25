const pack_renderer = require('./pack_renderer');
const pack_deps = require('./pack_deps');
const pack_factory = require('./pack_factory');
const compile = require('../compile');
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const Coder = require('./coder');
const { cache, rdr_ext, cls_ext , dest_ext } = require('../def');
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
        rdr_path = path.join(src_dir, file + rdr_ext),
        cls_path = path.join(src_dir, file + cls_ext),
        dest_path = path.join(dest_dir, file + dest_ext),
        coder = new Coder();

        let cls_exist = true;
        if (!fs.existsSync(rdr_path)) throw FileNotFound(rdr_path);
        if (!fs.existsSync(cls_path)) cls_exist = false;

        const rdr_source = fs.readFileSync(rdr_path, 'utf8'),
        cls_source = cls_exist && fs.readFileSync(cls_path, 'utf8') || '',  
        [include_list, ast] = compile(rdr_source, rdr_path),
        [deps, files] = convert(include_list);

        if (!fs.existsSync(dest_dir))
            mkdirp.sync(dest_dir);
        coder.add_section(pack_deps(include_list));
        coder.add_newline();
        coder.add_section(cls_source);
        coder.add_newline();
        coder.add_section(pack_renderer(files, ast, file));
        coder.add_newline();
        coder.add_section(pack_factory(file, cls_exist));
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