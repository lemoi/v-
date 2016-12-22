import { vm as _v_vm } from 'vpp';

import { Component } from 'vpp';

class Card extends Component {
    constructor() {
        super()
    }
}
function _v_Card_vm () {
    const { Define, Element, For, 
    Value, If, ViewModel, 
    VText } = _v_vm;
    return new ViewModel("Card", {
    "name.type": Vpp.Types.string,
    "name": "1",
    "id.type": Vpp.Types.p(1,2),
    "id": 3
    }, [
    new Element("div", {
    chekced: true
    }, [
    new VText(new Value(function(){return this.get("name");}))
    ])
    ]);
}

export const _v_Card_f = _v_factory_helper(Card, _v_Card_vm);
