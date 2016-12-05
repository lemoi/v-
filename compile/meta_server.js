const  { NotImplement } = require('../def.js')

class Meta {}

class ForMeta extends Meta {
    //fields [key, value] || value
    constructor (fields, obj) {
        super()
        this.metaName = 'for'
        this.fields =  fields
        this.obj = obj
        this.scope = []
    }
}

class IncludeMeta extends Meta{
    constructor (file) {
        super()
        this.file = file
        this.metaName = 'include'
    }
} 

class IfMeta extends Meta {
    constructor (condtion) {
        super()
        this.metaName = 'if'
        this.branch = [new IfMeta.Branch(condtion)]
        this.current = 0
        this.scope = this.branch[this.current++].scope
    }

    add_branch (condtion = null) {
        //else 
        if (condtion === null) condtion = '__else__'
        this.branch.push(new IfMeta.Branch(condtion))
        this.scope = this.branch[this.current++].scope
    }
}
IfMeta.Branch = function (condtion) {
    this.condtion = condtion
    this.scope = []
}
class DefineMeta extends Meta {
    constructor (field, expression) {
        super()
        this.metaName = 'define'
        this.field = field
        this.expression = expression
        this.scope = []
    }
}

module.exports = { ForMeta, IncludeMeta, IfMeta, DefineMeta }