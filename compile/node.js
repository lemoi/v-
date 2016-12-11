const  { NotImplement } = require('../def.js')
const { Meta } = require('./meta.js')

class Node {
    pack () { throw NotImplement }
}

Node.ELEMENT_NODE = 1
Node.VALUEABLE_NODE = 2
Node.TEXT_NODE = 3
Node.DEFINITION_NODE = 4

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

//text node 
class TNode extends Node {
    constructor (value) {
        super()
        this.nodeType = Node.TEXT_NODE
        this.value = value
    }
}

//valueable node
class VNode extends Node {
    constructor (tokens) {
        super()
        this.nodeType = Node.VARIABLE_NODE
        this.tokens = token
    }
}

module.exports = { DNode, TNode, VNode, ENode }