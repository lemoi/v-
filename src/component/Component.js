import { VReferenceError } from '../error_runtime';

export default class Component {
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
        this.__v__.update()
    }

    update () {
        this.__update__()
    }
}