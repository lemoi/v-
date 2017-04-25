import { Component } from 'vpp';

class Button extends Component {
    __beforeLoad__ () {
        console.log('load start');
    }

    __didLoad__ () {
        console.log('load end');
    }

    __beforeUnload__ () {
        console.log('unload');
    }
}