
class Card extends Component {
    constructor() {
        super()
    }
}
function _$_Card_vm () {
    return new ViewModel({
    name: null
    }, [
    "\n    ",
    new Element("div", [
    new Value(function(){return this.get("name");})
    ]),
    "\n"
    ]);
}

export const _$_Card_f = factory_helper(Card, _$_Card_vm);
