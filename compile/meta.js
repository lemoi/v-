const  { NotImplement } = require('../def.js')
const path = require('path')

class Meta {}

class ForMeta extends Meta {
    //fields [key, value] || value
    constructor (fields, obj) {
        super()
        this.metaName = 'for'
        this.fields =  fields
        this.obj = obj
        this.children = []
    }
}

class IncludeMeta extends Meta{
    constructor (filePath) {
        super()
        this.filePath = filePath
        this.metaName = 'include'
        this.file = path.basename(filePath)
    }
} 

class IfMeta extends Meta {
    constructor (condtion) {
        super()
        this.metaName = 'if'
        this.branch = [new IfMeta.Branch(condtion)]
        this.current = 0
        this.children = this.branch[this.current++].children
    }

    add_branch (condtion = null) {
        //else 
        if (condtion === null) condtion = '__else__'
        this.branch.push(new IfMeta.Branch(condtion))
        this.children = this.branch[this.current++].children
    }
}
IfMeta.Branch = function (condtion) {
    this.condtion = condtion
    this.children = []
}
class DefineMeta extends Meta {
    constructor (field, expression) {
        super()
        this.metaName = 'define'
        this.field = field
        this.expression = expression
        this.children = []
    }
}

module.exports = { ForMeta, IncludeMeta, IfMeta, DefineMeta }