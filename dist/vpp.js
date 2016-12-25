(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.vpp = factory());
}(this, (function () { 'use strict';

class Value {
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

function get$1 (root, traces) {
    let target = root;
    traces.forEach(function (p) {
        target = target[p];
    });
    return target;
}

const ip = Value.instance_map;
const dep = '$.$';
function observe$1 () {
    const root = {};

    function add (uid, traces) {
        let target = root;
        traces.forEach(function (p) {
            if (target.hasOwnProperty(p))
                target = target[p];
            else {
                target = target[p] = {};
            }
        });
        if (!target.hasOwnProperty(dep))
            target[dep] = new Set();
        target[dep].add(uid);
    }

    function spread (current, operation) {
        for (let i in current) {
            let t = current[i];
            if (i == dep && t.size) {
                t.forEach(function (uid) {
                    if (ip.hasOwnProperty(uid))
                        ip[uid].update(operation);
                    else
                        t.delete(uid); //gc
                });
            } else {
                spread(t, operation);
            }
        }
    }

    function notify (traces, operation) {
        try {
            spread(get$1(root, traces), operation);
        } catch (e) {
            return false;
        }
    }

    return { add, notify };
}

class Scope {
    constructor () {
        this.scope = null;
        this.observer = observe$1();
    }

    init () {
        set_scope(this);
    }

    value (traces) {
        if (this.fields.hasOwnProperty(traces[0])) {
            return get$1(this.fields, traces);
        } else {
            return this.scope.value(traces);    
        }
    }

    value_with_trace (uid, traces) {
        if (this.fields.hasOwnProperty(traces[0])) {
            this.observer.add(uid, traces);
            return get$1(this.fields, traces);
        } else {
            return this.scope.value_with_trace(uid, traces);    
        }
    }
}

const VReferenceError = (component, which) =>
    new Error(which + 'is not defined in ' + component);

const VTypeError = (component, arg) =>
    new Error('Invaild argument type of ' + arg + ' passed to ' + component);

const VArgumentError = (component, arg, few) =>
    new Error((few ? 'too few' : 'too many') +
    ' arguments to ' + component + ' -> ' + arg);

class ViewModel extends Scope {
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
        set_params(this, params);
    }
}

//#ifndef PRODUCTION
//#endif

function is_str (obj) {
    return typeof obj == 'string';
}

/* the poh is an abbreviation for the parent or host */
function set_parent (parent, children) {
    if (children === null) return;
    for (let child of children) {
        if (is_str(child))
            continue;
        child.__poh__ = parent;
    }
}

function set_host (host, params) {
    if (params === null) return;
    for (let k in params) {
        if (params[k] instanceof Value) {
            params[k].__poh__ = host;
            params[k].name = k;
        }
    }
}

function set_params (vm, params) {
    if (params !== null) {
        for (let p in params) {
//#ifndef PRODUCTION
            if (!(p in vm.parameters))
                throw VArgumentError(vm.name, p, false);
//#endif
            vm.parameters[p] = params[p]; 
        }
    }
    if (vm.parameters !== null) {
        for (let p in vm.parameters) {
            let v = vm.parameters[p];
//#ifndef PRODUCTION
            if (p.slice(-4) == '.type') {
                let p_base = p.slice(0, -4);
                if (!v(vm.parameters[p_base]))
                    throw VTypeError(vm.name, p_base); 
                continue;
            }
            if (v === null)
                throw VArgumentError(vm.name, p, true);
//#endif    
            if (v instanceof Value) v = v.ValueOf();
            vm.__m__.__argv__[p] = v;
        }
    }
}

function set_scope (unit) {
    let poh = unit.__poh__;
    poh = (poh instanceof Scope) && 
        !(poh instanceof ViewModel) ? poh.__poh__ : poh;
    while (poh !== null) {
        if (poh instanceof Scope) {
            break;
        }
        poh = poh.__poh__;
    }
    unit.scope = poh;
}

class Define extends Scope {
    constructor (fields, expression, children) {
        super();
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

class Element {
    constructor (tagName, parameters, children) {
        this.tagName = tagName;
        this.native = null;
        this.parameters = parameters;
        this.children = children;
        set_parent(this, children);
        set_host(this, parameters);
    }
}

class For extends Scope {
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
        super.init();
    }
}

class VAttr extends Value {
    constructor (vf, pure) {
        super(vf);
    }
}

class If {
    //[[codition1, [chidren1]], [condtion2, [children2]]]
    constructor (branch_list) {
        this.branchs = [];
        for (let b of branch_list) {
            this.branchs.push(new If.Branch(b[0], b[1]));
            set_parent(this, b[1]);
            b[0].__poh__ = this;
        }
    }
}
If.Branch = function (condition, children) {
    this.condition = condition;
    this.children = children;
}

class VText extends Value {
    constructor (vf, pure) {
        super(vf, pure);
        this.native = null;
    }

    update (data) {

    }
}



var vm = Object.freeze({
	Define: Define,
	Element: Element,
	For: For,
	VAttr: VAttr,
	If: If,
	ViewModel: ViewModel,
	VText: VText,
	Value: Value
});

function type_sheck (obj, type) {
    return Object.prototype.toString.call(obj) == '[object ' + type + ']';
}

const number = (obj) => type_sheck(obj, 'Number');
const string = (obj) => type_sheck(obj, 'String');
const bool = (obj) => type_sheck(obj, 'Boolean');
const array = (obj) => type_sheck(obj, 'Array');
const func = (obj) => type_sheck(obj, 'Function');
const symbol = (obj) => type_sheck(obj, 'Symbol');
const object = (obj) => type_sheck(obj, 'Object');



var types = Object.freeze({
	number: number,
	string: string,
	bool: bool,
	array: array,
	func: func,
	symbol: symbol,
	object: object
});

class Component {
    constructor () {
        this.__argv__ = Object.create(null);
    }

    __beforeLoad__ () {

    }
    
    __didLoad__ () {

    }

    __didUnload__ () {

    }

    $ () {
        
    }

    __update__ (traces, operation) {
        
    }
}

class DefaultModel extends Component {}

function create_factory (vm_constructor, m_constructor = DefaultModel) {
    return function (params) {
        let m = new m_constructor();
        let vm = new vm_constructor();
        m.__vm__ = vm;
        vm.__m__ = m;
        m.__beforeLoad__();
        vm.init(params);
        return vm;
    }
}

var vpp = {
    local: typeof window !== "undefined" ? window : global,
    version: "0.1.0",
    vm, types, Component, create_factory
};

return vpp;

})));
