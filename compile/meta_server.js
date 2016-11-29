const  { NotImplement } = require('../def.js')

class Meta {}

class ForMeta extends Meta {
    constructor () {
        super()
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
    constructor () {
        super()
        this.metaName = 'if'  
    }

}

class DefineMeta extends Meta {
    constructor () {
        super()
    }
}

module.exports = { ForMeta, IncludeMeta, IfMeta, DefineMeta }