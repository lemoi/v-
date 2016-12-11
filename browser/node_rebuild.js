const  { NotImplement } = require('../def.js')

class Node {
}

//definition node
class DNode extends Node {
    constructor (name) {
        super()
        this.nodeType = Node.DEFINITION_NODE
        this.children = []
        this.parameters = {}
        this.nodeName = name
    }

    set_param (name, default_value = null) {
        this.parameters[name] = default_value
    }

    pack () {
        const buffer = []
        buffer.push('function () {')
        buffer.push('let scope = new DNode()')
    }
}

//element node
class ENode extends Node {
    constructor (name) {
        super()
        this.nodeType = Node.ELEMENT_NODE
        this.children = []
        this.nodeName = name
        this.attributes = {}
    }

    set_param (name, value = null) {
        this.attributes[name] = value
    }

}

//instance node
class INode extends Node {
    constructor (name) {
        super()
        this.nodeType = Node.INSTANCE_NODE
        this.children = []
        this.nodeName = name
        this.parameters = {}
    }

    set_param (name, value = null) {
        this.parameters[name] = value
    }

}

//text node 
class TNode extends Node {
    constructor (value) {
        super()
        this.nodeType = Node.TEXT_NODE
        this.value = value
    }
}

//variable node
class VNode extends Node {
    constructor (name, scope) {
        super()
        this.nodeType = Node.VARIABLE_NODE
        this.field = name
    }
}

//attribute node
class ANode extends Node {
    constructor (name, scope) {
        super()
        this.nodeType = Node.ATTRIBUTE_NODE
        this.field = name
    }    
}

module.exports = { DNode, TNode, VNode, ENode }