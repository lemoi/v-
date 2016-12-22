import Value from './Value';
import Scope from './Scope';
import ViewModel from './ViewModel';
//#ifndef production
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
        }
    }
}

export function set_params (vm, params) {
    if (params !== null) {
        for (let p in params) {
//#ifndef production
            if (!(p in vm.parameters))
                throw VArgumentError(vm.name, p, false);
//#endif
            vm.parameters[p] = params[p]; 
        }
    }
    if (vm.parameters !== null) {
        for (let p in vm.parameters) {
//#ifndef production
            if (vm.parameters[p] === null)
                throw VArgumentError(vm.name, p, true);
//#endif
            let val = vm.parameters[p];
            vm.__m__.__argv__[p] = val instanceof Value ? val.ValueOf() : val;
        }
    }
}

export function set_scope (unit) {
    let poh = unit.__poh__;
    poh = (poh instanceof Scope) && 
        !(poh instanceof ViewModel) ? poh.__poh__ : poh;
    while (poh !== null) {
        if (poh instanceof Scope) {
            unit.scope = poh;
        }
        poh = poh.__poh__;
    }
}