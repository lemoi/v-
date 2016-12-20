const Scope = require('Scope');

class Value {
    constructor (valuef) {
        this.valuef = valuef;
        this.cache = Object.create(null);
    }

    get (var_name) {
        if (var_name in this.cache) {
            return this.cache[var_name].value(var_name)
        }
        let poh = (this.poh instanceof Scope) 
        && this.poh.poh !== null
        ? this.poh.poh : this.poh;

        while (poh !== null) {
            if (poh instanceof Scope && 
                poh.has(var_name)) {
                this.cache[var_name] = poh;
                return poh.value(var_name);
            }
            poh = poh.poh
        }
    }

    value () {
        return this.valuef();
    }
}
module.exports = Value;