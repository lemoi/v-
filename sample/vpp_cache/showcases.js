import { vm as _v_vm, create_factory as _v_create_factory } from 'vpp'
import { _v_Card_f as _v_Card } from './Card.js';

import { Component } from 'vpp';

class showcases extends Component {
    constructor() {
        super()
    }
}
function _v_showcases_vm () {
    const { Define, Element, For, 
    Value, If, ViewModel, 
    VText } = _v_vm;
    return new ViewModel("showcases", null, [
    new For({"i":null,"j":null}, new Value(function(){return [1,2,3];}), function(){return [
    _v_Card({
    name: new Value(function(){return this.get("i");}),
    is_a: true
    }, null)
    ];})
    ]);
}

export const _v_showcases_f = _v_create_factory(showcases, _v_showcases_vm);
