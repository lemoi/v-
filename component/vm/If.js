const { set_parent } = require('./helper.js')

class If {
    //[[codition1, [chidren1]], [condtion2, [children2]]]
    constructor (branch_list) {
        this.branchs = []
        for (let b of branch_list) {
            this.branchs.push(new If.Branch(b[0], b[1]))
            set_parent(b[1], this)
            b[0].poh = this;
        }
    }
}
If.Branch = function (condition, children) {
    this.condition = condition;
    this.children = children;
}
module.exports = If;
