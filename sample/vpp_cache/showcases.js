import { vm as _v_vm, create_factory as _v_create_factory } from 'vpp';
import { types as _v_types } from 'vpp';
import { _v_Card_f as _v_c } from './Card';
import { _v_Card_f as _v_b } from './Card';


function _v_showcases_vm () {
    const { Define, Element, For, 
    VAttr, If, ViewModel, 
    VText } = _v_vm;
    return new ViewModel("showcases", null, [
    new For({ "i": null, "j": null }, new Value(function () { return this.get(["h","l","slice"])(1,2); }, false), function () { return [
    _v_c({
    name: new VAttr(function () { return this.get(["i"]); }, true),
    is_a: true
    }, null)
    ]; }),
    new Define({ "a": null }, new Value(function () { return 1234; }, true), [
    new If([[
    new Value(function () { return this.get(["a"]); }, true), [
    new VText(function () { return this.get(["c"]); }, true)
    ]], [
    new Value(function () { return this.get(["c"]); }, true), null], [
    "__else__", null]
    ])
    ])
    ]);
}

export var _v_showcases_f = _v_create_factory(_v_showcases_vm)
