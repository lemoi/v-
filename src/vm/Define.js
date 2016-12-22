import { set_parent, set_scope } from './helper';
import Scope from './Scope';

export default class Define extends Scope {
    constructor (field, expression, children) {
        super()
        this.field = field;
        this.children = children;
        this.expression = expression;
        expression.__poh__ = this;
        set_parent(this, children);
    }

    value (var_name) {
        if (this.field == var_name)
            return this.expression.valueOf();
        else
            return this.scope.value(var_name);
    }

    init () {
        super.init();
    }
}