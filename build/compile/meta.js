const { NotImplement } = require('../error_static');
const path = require('path');
const Coder = require('../packer/coder');

class Meta {
    serialize () { throw NotImplement('serialize in ' + this.constructor.name) };
}

class ForMeta extends Meta {
    //fields [key, value] || value
    constructor (fields, obj) {
        super();
        this.metaName = 'for';
        this.fields =  fields;
        this.obj = obj;
        this.children = [];
    }

    serialize (is_instance, indent) {
        let coder = new Coder(indent),
        has_children = this.children.length != 0,
        fields = {};
        for (let i of this.fields) {
            fields[i] = null;
        }
        coder.add('new For('+ JSON.stringify(fields) + ', ' + this.obj.serialize() + ', ');

        if (has_children) {
            coder.add('function(){return [');
            let first = true;
            for (let child of this.children) {
                if (first) first = false;
                else coder.add(',');
                coder.add_newline();
                coder.add_line(child.serialize(is_instance, indent), false);
            }
            coder.add_newline();
            coder.add_line('];}', false);
        } else {
            coder.add('null');
        }

        coder.add(')');

        return coder.toString();
    }
}

class IncludeMeta extends Meta {
    constructor (filePath, alias = null) {
        super();
        this.filePath = filePath;
        this.metaName = 'include';
        this.file = path.basename(filePath);
        this.alias = alias;
    }
} 

class IfMeta extends Meta {
    constructor (condtion) {
        super();
        this.metaName = 'if';
        this.branchs = [new IfMeta.Branch(condtion)];
        this.current = 0;
        this.children = this.branchs[this.current++].children;
    }

    add_branch (condtion = null) {
        //else 
        if (condtion === null) condtion = '__else__';
        this.branchs.push(new IfMeta.Branch(condtion));
        this.children = this.branchs[this.current++].children;
    }

    serialize (is_instance, indent) {
        let coder = new Coder(indent),
        has_branch = this.branchs.length != 0;
        coder.add('new If(');

        if (has_branch) {
            coder.add('[');
            let first = true;
            for (let branch of this.branchs) {
                if (first) first = false;
                else coder.add(', ');
                coder.add('[');
                coder.add_newline();
                let condtion = branch.condtion == '__else__' ? '"__else__"' : 
                                branch.condtion.serialize();
                coder.add_line(condtion + ', ', false);
                let children = branch.children;
                if (children.length != 0) {
                    coder.add('[');
                    let first = true;
                    for (let child of children) {
                        if (first) first = false;
                        else coder.add(',');
                        coder.add_newline();
                        coder.add_line(child.serialize(is_instance, indent), false);
                    }
                    coder.add_newline();
                    coder.add_line(']', false);
                } else {
                    coder.add('null');
                }
                coder.add(']');
            }
            coder.add_newline();
            coder.add_line(']', false);
        }

        coder.add(')');

        return coder.toString();
    }
}
IfMeta.Branch = function (condtion) {
    this.condtion = condtion;
    this.children = [];
}

class DefineMeta extends Meta {
    constructor (field, expression) {
        super();
        this.metaName = 'define';
        this.field = field;
        this.expression = expression;
        this.children = [];
    }

    serialize (is_instance, indent) {
        let coder = new Coder(indent),
        has_children = this.children.length != 0;
        coder.add('new Define('+ JSON.stringify(this.field) + ', ' + this.expression.serialize() + ', ');

        if (has_children) {
            coder.add('[');
            let first = true;
            for (let child of this.children) {
                if (first) first = false;
                else coder.add(',');
                coder.add_newline();
                coder.add_line(child.serialize(is_instance, indent), false);
            }
            coder.add_newline();
            coder.add_line(']', false);
        } else {
            coder.add('null');
        }

        coder.add(')');

        return coder.toString();
    }
}

module.exports = { ForMeta, IncludeMeta, IfMeta, DefineMeta };