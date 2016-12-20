const { set_parent } = require('./helper.js') 
class Define extends Scope {
    constructor (field, expression, children) {
        super()
        this.field = field;
        this.children = children;
        this.expression = expression;
        expression.poh = this;
        set_parent(children, this);
    }

    has (var_name) {
        return this.field == var_name;
    }

    value (var_name) {
        return this.expression.value();
    }
}
module.exports = Define;