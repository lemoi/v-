import Scope from './Scope';
import ViewModel from './ViewModel';
import { set_scope } from './helper';

export default class Value {
    constructor (valuef) {
        this.valuef = valuef;
        this.scope = null;
    }

    get (var_name) {
        if (this.scope == null)
            set_scope(scope);
        return this.scope.value(var_name)
    }

    valueOf () {
        return this.valuef();
    }
}