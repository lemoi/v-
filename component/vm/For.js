class For extends Scope {
    //field {k: v} or {k1: v1, k2: v2}
    //fpc: a function used for producing children
    constructor (field, obj, fpc) {
        super()
        this.field = field;
        this.fpc = fpc;
        this.obj = obj;
        obj.poh = this;
        this.children = fpc === null ? null : [];
    }

    has (var_name) {
        return (var_name in this.field);
    }

    value (var_name) {
        return this.field[var_name];
    }
}
module.exports = For;