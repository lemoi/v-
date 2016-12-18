import { _$_Card_f as _$_Card } from "./Card.js";

class showcases extends Component {
    constructor() {
        super()
    }
}
function _$_showcases_vm () {
    return new ViewModel([
    "\n",
    new For("i", new Value(function(){return [1,2,3];}), [
    "\n",
    _$_Card({
    name: new Value(function(){return this.get("i");})
    }),
    "\n"
    ]),
    "\n"
    ]);
}

export const _$_showcases_f = factory_helper(showcases, _$_showcases_vm);
