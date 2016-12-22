(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.vpp = factory());
}(this, (function () { 'use strict';

class Scope {
    constructor () {
        this.scope = null;
    }

    init () {
        set_scope(this);
    }
}

class ViewModel extends Scope {
    constructor (name, parameters, children) {
        super();
        this.name = name;
        this.parameters = parameters;
        this.children = children;
        set_parent(this, children);
        set_host(this, parameters);
    }
    //params from the parent
    init (params) {
        set_params(this, params);
        this.__m__.__didLoad__();
    }

    value (var_name) {
        return this.__m__.__value__(var_name);
    }

    render () {
        
    }

    destroy () {

    }

    update () {
        set_params(this, params);
    }
}

class Value {
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

const VReferenceError = (component, which) =>
    new Error(which + 'is not defined in ' + component);

const VTypeError = (component, arg) =>
    new Error('Invaild argument type of ' + arg + ' passed to ' + component);

const VArgumentError = (component, arg, few) =>
    new Error((few ? 'too few' : 'too many') +
    ' arguments to ' + component + ' -> ' + arg);

//#ifndef production
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
        }
    }
}

function set_params (vm, params) {
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

function set_scope (unit) {
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

class Define extends Scope {
    constructor (field, expression, children) {
        super();
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
    constructor (field, obj, fpc) {
        super();
        this.field = field;
        this.fpc = fpc;
        this.obj = obj;
        obj.__poh__ = this;
        this.children = fpc === null ? null : [];
        this.scope = null;
    }

    value (var_name) {
        if (this.field.hasOwnProperty(var_name))
            return this.field[var_name];
        else
            return this.scope.value(var_name);    
    }

    init () {
        super.init();
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

class VText {
    constructor (value) {
        this.native = null;
        this.text = value;
    }
}



var vm = Object.freeze({
	Define: Define,
	Element: Element,
	For: For,
	Value: Value,
	If: If,
	ViewModel: ViewModel,
	VText: VText
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

class Component$1 {
    constructor () {
        this.__argv__ = Object.create(null);
    }

    __value__ (var_name) {
        if (this.hasOwnProperty(var_name))
            return this[var_name];
        else if (this.argv.hasOwnProperty(var_name))
            return this.argv[var_name];
        else 
            throw VReferenceError(this.__m__.name, var_name);
    }

    __beforeLoad__ () {

    }
    
    __didLoad__ () {

    }

    __didUnload__ () {

    }

    __update__ () {
        this.__v__.update();
    }

    update () {
        this.__update__();
    }
}

function create_factory (m_constructor, vm_constructor) {
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

const vpp = {
    vm, types, Component: Component$1, create_factory
};

return vpp;

})));
