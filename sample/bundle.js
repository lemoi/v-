import { Component } from 'react';
import { Component as Component$1 } from 'vpp';

class Card extends Component {
    constructor() {
        super();
    }
}
function Card_vm () {
    return new ViewModel({
    name: new Value(function(){return 1;})
    }, [
    new Element("div", null, [
    new Value(function(){return this.get("name");})
    ]),
    new Define("o", new Value(function(){return this.get("i")+1;}), null)
    ]);
}

const Card_f = factory_helper(Card, Card_vm);

class showcases extends Component$1 {
    constructor() {
        super();
    }
}
function showcases_vm () {
    return new ViewModel(null, [
    new For({"i":null,"j":null}, new Value(function(){return [1,2,3];}), [
    Card_f({
    name: new Value(function(){return this.get("i");})
    }, null)
    ])
    ]);
}

const showcases_f = factory_helper(showcases, showcases_vm);

export { showcases_f };
