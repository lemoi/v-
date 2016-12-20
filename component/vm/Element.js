const { set_parent, set_host } = require('./helper.js')

class Element {
    constructor (tagName, parameters, children) {
        this.tagName = tagName;
        this.native = null;
        this.parameters = parameters;
        this.children = children;
        set_parent(children, this);
        set_host(parameters, this);
    }
}
module.exports = Element;