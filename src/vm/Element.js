import { set_parent, set_host } from './helper';

export default class Element {
    constructor (tagName, parameters, children) {
        this.tagName = tagName;
        this.native = null;
        this.parameters = parameters;
        this.children = children;
        set_parent(this, children);
        set_host(this, parameters);
    }
}