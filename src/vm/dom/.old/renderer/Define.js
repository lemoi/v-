import { set_parent, set_scope } from './helper';
import Scope from './Scope';

export default class Define extends Scope {
    constructor (fields, expression, children) {
        super()
        this.fields = fields;
        this.children = children;
        this.expression = expression;
        expression.__poh__ = this;
        set_parent(this, children);
        this.observer = observe();
    }

    init () {
        super.init();
    }
}