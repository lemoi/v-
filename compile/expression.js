class Type {}

class TString extends Type {
    constructor (str) {
        super()
        this.str = str
    }
}

class TNumber extends Type {
    constructor (value) {
        super()
        this.value = value
    }
}

class TVariable extends Type {
    constructor (name) {
        super()
        this.name = name
    }
}

module.exports = {TString, TNumber, TVariable}