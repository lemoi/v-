import { set_parent, set_host, set_params } from './helper';
import Scope from './Scope';
import { VReferenceError } from '../error_runtime';
import vpp from '../vpp';

export default class ViewModel extends Scope {
    constructor (name, parameters, children) {
        super();
        this.name = name;
        this.parameters = parameters;
        this.children = children;
        this.__m__ = null;
        set_parent(this, children);
        set_host(this, parameters);
    }
    //params from the parent
    init (params) {
        set_params(this, params);
        this.__m__.__didLoad__();
    }

    value (traces) {
        let ns = traces[0], m = this.__m__;
        if (m.hasOwnProperty(ns))
            return get(m, traces);
        else if (m.__argv__.hasOwnProperty(ns))
            return get(m.__argv__, traces);
        else if (vpp.local.hasOwnProperty(ns))
            return get(vpp.local, traces);
        else
            throw VReferenceError(this.name, traces);
    }

    value_with_trace (uid, traces) {
        this.observer.add(uid, traces);
        return this.value(traces);
    }


    render () {
        
    }

    destroy () {

    }

    update () {
        set_params(this, params)
    }
}