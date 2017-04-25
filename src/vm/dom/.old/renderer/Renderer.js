import { set_parent, set_host, set_params } from './helper';
import Scope from './Scope';
import { VReferenceError } from '../error_runtime';
import vpp from '../vpp';

export default class Renderer extends Scope {
    constructor (name, parameters, children) {
        super();
        this.name = name;
        this.parameters = parameters;
        this.children = children;
        this.instance = null;
        this.content = null;
    }
    //params from the parent
    init (params, content) {
        this.instance.__beforeLoad__();
        init_children(this, children);
        if (params !== null) {
            for (let p in params) {
//#ifndef PRODUCTION
                if (!this.parameters.hasOwnProperty(p))
                    throw VArgumentError(this.name, p, false);
//#endif
                this.parameters[p] = params[p];
            }
        }
        init_params(this, this.parameters);
        if (this.parameters !== null) {
            for (let p in this.parameters) {
                let v = this.parameters[p];
//#ifndef PRODUCTION
                if (p.slice(-4) == '.type')
                    continue;

                if (v === null)
                    throw VArgumentError(rd.name, p, true);
//#endif    
                if (v instanceof Value) v = v.init();
//#ifndef PRODUCTION
                let check = p + '.type';
                if (this.parameters.hasOwnProperty(check)&&
                    !this.parameters[check](v))
                    throw VTypeError(this.name, p);
//#endif
                this.instance.__argv__[p] = v;
            }
        }
        this.instance.__didLoad__();
    }

    update_argv () {
    }

    value (traces) {
        let ns = traces[0], ins = this.instance;
        if (ins.hasOwnProperty(ns))
            return get(ins, traces);
        else if (ins.__argv__.hasOwnProperty(ns))
            return get(ins.__argv__, traces);
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

    }
}