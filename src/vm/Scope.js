import { set_scope } from './helper';

export default class Scope {
    constructor () {
        this.scope = null;
    }

    init () {
        set_scope(this);
    }
}