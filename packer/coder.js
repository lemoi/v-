class Coder {
    constructor (indent = 0) {
        this.lineNumber = 1
        this._indent = indent
        this.buffer = []
    }

    add_line (str) {
        this.buffer.push(Coder.INDENT_CHARACTER.repeat(this._indent) 
            + str + Coder.LE)
        this.lineNumber++ 
    }

    indent () {
        this._indent += Coder.INDENT_LEVEL
    }

    toString () {
        return this.buffer.join('')
    }
}

Coder.LE = '\n'
Coder.INDENT_CHARACTER = ' '
Coder.INDENT_LEVEL = 4

module.exports= Coder