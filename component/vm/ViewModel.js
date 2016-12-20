const { set_parent, set_host } = require('./helper.js');
const { VReferenceError, VTypeError } = require('../../error/error_runtime');
const Value = require('./Value.js');

class ViewModel extends Scope {
    constructor (name, parameters, children) {
        super()
        this.name = name;
        this.parameters = parameters;
        this.children = children;
        this.poh = null;
        set_parent(children, this);
        set_host(parameters, this);
    }
    //params from the parent
    init (params) {
        for (let p in params) {
            let type_checker = p + '.type';
            if (type_checker in this.parameters) {
                let value = params[p]; 
                if (value instanceof Value)
                    value = value.value()
                if (!this.parameters[type_checker](value))
                    throw VTypeError(this.name, p);
            }
        }
    }

    has (var_name) {
        if ((var_name in this.__m__) || 
            ((this.parameters !== null) && 
            (var_name in this.parameters))) {
            return true;
        }
        throw VReferenceError(this.name, var_name);
    }

    value (var_name) {
        if (var_name in this.parameters) {
            let v = this.parameters[var_name];
            if (v instanceof Value)
                return v.value();
            return v;
        } else {
            return this.__m__[var_name]
        }
    }

    render (coder) {
        
    }
}

module.exports = ViewModel;