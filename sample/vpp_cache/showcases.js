import { Card_f as Card } from "./Card.js";

import { Component } from 'react';

class showcases extends Component {
    constructor() {
        super()
    }
}
function showcases_vm () {
    return new ViewModel("showcases", null, [
    new For({"i":null,"j":null}, new Value(function(){return [1,2,3];}), function(){return [
    Card({
    name: new Value(function(){return this.get("i");})
    }, null)
    ];})
    ]);
}

export const showcases_f = factory_helper(showcases, showcases_vm);
