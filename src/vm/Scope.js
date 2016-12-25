import { set_scope } from './helper';
import { observe, get } from '../trace/index';

export default class Scope {
    constructor () {
        this.scope = null;
        this.observer = observe();
    }

    init () {
        set_scope(this);
    }

    value (traces) {
        if (this.fields.hasOwnProperty(traces[0])) {
            return get(this.fields, traces);
        } else {
            return this.scope.value(traces);    
        }
    }

    value_with_trace (uid, traces) {
        if (this.fields.hasOwnProperty(traces[0])) {
            this.observer.add(uid, traces);
            return get(this.fields, traces);
        } else {
            return this.scope.value_with_trace(uid, traces);    
        }
    }
}