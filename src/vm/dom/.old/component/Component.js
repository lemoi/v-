/*
Component is the warp of renderer and store;
usage:
function _v_Card_r () {
    const { Define, Element, For, 
    VAttr, If, Renderer, 
    VText, Value } = _v_renderer;
    return new Renderer("Card", {
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
class Component1 extends Component {
     
}
*/
export default class Component {
    constructor () {

    }
}