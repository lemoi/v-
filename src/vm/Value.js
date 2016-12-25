import { set_scope } from './helper';

export default class Value {
    constructor (vf, pure) {
        this.vf = vf;
        this.pure = pure;
        this.scope = null;
        this.data = null;
        this.uid = Value.uid++;
        Value.instance_map[this.uid] = this;
    }

    get (traces) {
        return this.scope.value_with_trace(this.uid, traces);
    }

    get_without_trace (traces) {
        return this.scope.value(traces)
    }

    init () {
        set_scope(this);
        this.data = this.vf;
        this.get = this.get_without_trace;
    }

    destory () {
        delete Value.instance_map[this.uid];
    }

}

Value.uid = 0;
Value.instance_map = {};