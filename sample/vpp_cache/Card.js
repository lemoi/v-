import { vm as _v_vm, create_factory as _v_create_factory } from 'vpp';
import { types as _v_types } from 'vpp';


function _v_Card_vm () {
    const { Define, Element, For, 
    VAttr, If, ViewModel, 
    VText } = _v_vm;
    return new ViewModel("Card", {
    "name.type": _v_types.string,
    "name": "1",
    "id.type": _v_types.p(1,2),
    "id": 3
    }, [
    new Element("div", {
    chekced: true
    }, [
    new VText(function () { return this.get(["name"]); }, true)
    ])
    ]);
}

export var _v_Card_f = _v_create_factory(_v_Card_vm)
