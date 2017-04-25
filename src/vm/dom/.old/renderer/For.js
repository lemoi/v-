import Scope from './Scope';

export default class For extends Scope {
    //field {k: v} or {k1: v1, k2: v2}
    //fpc: a function used for producing children
    constructor (fields, vf, fpc) {
        super();
        this.fields = fields;
        this.fpc = fpc;
        this.obj = obj;
        obj.__poh__ = this;
        this.children = fpc === null ? null : [];
        this.scope = null;
        this.observer = observe();
    }

    init () {
        super.init()
    }
}