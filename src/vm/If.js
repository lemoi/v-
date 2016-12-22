import { set_parent } from './helper';

export default class If {
    //[[codition1, [chidren1]], [condtion2, [children2]]]
    constructor (branch_list) {
        this.branchs = []
        for (let b of branch_list) {
            this.branchs.push(new If.Branch(b[0], b[1]))
            set_parent(this, b[1]);
            b[0].__poh__ = this;
        }
    }
}
If.Branch = function (condition, children) {
    this.condition = condition;
    this.children = children;
}
