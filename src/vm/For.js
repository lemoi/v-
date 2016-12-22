import Scope from './Scope';

export default class For extends Scope {
    //field {k: v} or {k1: v1, k2: v2}
    //fpc: a function used for producing children
    constructor (field, obj, fpc) {
        super()
        this.field = field;
        this.fpc = fpc;
        this.obj = obj;
        obj.__poh__ = this;
        this.children = fpc === null ? null : [];
        this.scope = null;
    }

    value (var_name) {
        if (this.field.hasOwnProperty(var_name))
            return this.field[var_name];
        else
            return this.scope.value(var_name);    
    }

    init () {
        super.init()
    }
}