import { set_parent, set_host, set_params } from './helper';
import Scope from './Scope';
import Value from './Value';

export default class ViewModel extends Scope {
    constructor (name, parameters, children) {
        super()
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
        set_params(this, params)
    }
}