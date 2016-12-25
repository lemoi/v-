import { create_factory, vm } from 'vpp';

function _v_Card_vm () {
    const { Define, Element, For, 
    VAttr, If, ViewModel, 
    VText } = vm;
    return new ViewModel("Card", {
    "name": "1",
    "id": 3
    }, [
    new Element("div", {
    chekced: true
    }, [
    new VText(function () { return this.get("name"); })
    ])
    ]);
}

var _v_Card_f = create_factory(_v_Card_vm);

function _v_showcases_vm () {
    const { Define, Element, For, 
    VAttr, If, ViewModel, 
    VText } = vm;
    return new ViewModel("showcases", null, [
    new For({ "i": null, "j": null }, new VAttr(function () { return [1,2,3]; }), function () { return [
    _v_Card_f({
    name: new VAttr(function () { return this.get("i"); }),
    is_a: true
    }, null)
    ]; })
    ]);
}

var _v_showcases_f = create_factory(_v_showcases_vm);

export { _v_showcases_f };
