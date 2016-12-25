const { NotImplement } = require('../error_static');

class Type {
    serialize () { throw NotImplement };
}

class TString extends Type {
    constructor (str) {
        super();
        this.str = str;
    }

    serialize () {
        return JSON.stringify(this.str);
    }
}

class TNumber extends Type {
    constructor (value) {
        super();
        this.value = value;
    }

    serialize () {
        return this.value;
    }
}

class TVariable extends Type {
    constructor (name) {
        super();
        this.name = name;
    }

    serialize () {
        let traces = this.name.split('.');
        traces = traces.map(function (p) {
            return JSON.stringify(p);
        });
        return 'this.get([' + traces.toString() + '])';
    }
}

module.exports = { TString, TNumber, TVariable };