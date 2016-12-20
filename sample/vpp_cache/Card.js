
import { Component } from 'react';

class Card extends Component {
    constructor() {
        super()
    }
}
function Card_vm () {
    return new ViewModel("Card", {
    "name": "1",
    "id": 3
    }, [
    new Element("div", null, [
    new VText(new Value(function(){return this.get("name");}))
    ]),
    new Define("o", new Value(function(){return this.get("i")+1;}), [
    new For({"i":null}, new Value(function(){return this.get("c");}), null)
    ])
    ]);
}

export const Card_f = factory_helper(Card, Card_vm);
