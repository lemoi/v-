import Value from './Value';
import Scope from './Scope';
import Renderer from './Renderer';
//#ifndef PRODUCTION
import { VTypeError, VArgumentError } from '../error_runtime';
//#endif

export function is_str (obj) {
    return typeof obj == 'string';
}

/* the poh is an abbreviation for the parent or host */
export function set_parent (parent, children) {
    if (children === null) return;
    for (let child of children) {
        if (is_str(child))
            continue;
        child.__poh__ = parent;
    }
}

export function set_host (host, params) {
    if (params === null) return;
    for (let k in params) {
        if (params[k] instanceof Value) {
            params[k].__poh__ = host;
            params[k].name = k;
        }
    }
}

export function check_params (rd) {
    if (rd.parameters !== null) {
        for (let p in rd.parameters) {
            let v = rd.parameters[p];
//#ifndef PRODUCTION
            if (p.slice(-4) == '.type') {
                let p_base = p.slice(0, -4);
                if (!v(rd.parameters[p_base]))
                    throw VTypeError(rd.name, p_base); 
                continue;
            }
            if (v === null)
                throw VArgumentError(rd.name, p, true);
//#endif    
            if (v instanceof Value) v = v.vf();
            rd.instance.__argv__[p] = v;
        }
    }
}

export function set_scope (unit) {
    let poh = unit.__poh__;
    poh = poh instanceof Scope ? poh.__poh__ : poh;
    while (poh !== null) {
        if (poh instanceof Scope) {
            break;
        }
        poh = poh.__poh__;
    }
    unit.scope = poh;
}