/*
@require({
    'i': './a'
})
@view(
<Button type: string = 'default'
        size: string = 'md'
        disabled: boolean = false
        on_click: function>
    <button class=[
                'btn',
                'btn-' + type,
                'btn-' + size,
                disabled && 'disabled']
            @click=on_click>
        #addin('gpu') <div>nvidia</div> #end
        #addin('cpu') <div>intel</div> #end
    </button>
</Button>
)
@style('button.css')
*/

thread.argv

thread.data = {}

thread.name = 'button'

thread.version = 'vpp@1.0.0'

thread.uuid = 1

thread.on('load', function () {
    console.log('loaded');
})

thread.data = Object.create(thread.argv)

thread.on('update', function (old, data) {
    thread.op('a.b&splice', 1, 2, 3)
})

thread.types['a'] = function (value, helper) {
    return helper.match(value, [helper.string, helper.number]);
}
/*
import { import } from 'vpp'
import('button.js').render()
*/
// ==2==
import { require, view, style } from 'vpp';
import { A } from './A';

@require({
    'a': A
})
@argv({

})
@view(`<>`)
@style(`
.a {

}
`)                      // context                
export function button({ argv, data, on }) {
    // argv not changeable
    let a = 10;
    let b = 10;

    data.click = function () {
        b = 100;
    }
    data['a'] = 123;

    on('update', function () {
        console.log('update');
    })
}

// ==3==
import { create } from 'vpp';

const button = create('button');

button.style();
button.view();
button.require();
button.data.a = ppp;

// ==4==

import { meta } from 'vpp';

@meta({
    declaration: `./a/abs.html#button
    <button type:string = 'default'
            size: string& = 'md'
            disabled: boolean = false
            click: function@
            color: string number = 'blue'>
        <button class=[
                    'btn',
                    'btn-' + type,
                    'btn-' + size,
                    disabled && 'disabled']
                click @= click>
        </button>
    </button>`,
    style: "adsdas",
    include: {
        'a': a
    },
    type: {// extends inner implments
        arrayOf: function (value, a, b) {

        }
    },
    operation: {// extends inner implements

    }
})
export function button(context) {
    const { argv, data, on } = context;
//   on('click', argv.click);
    
    @on('loaded')
    function () {
        data.c = 100;
        $.get('www.a.com', function (result) {
            data.r = result;
        })
    }
}

meta(obj)(button);

// ==5==

import { card } from './card.vx';

// declaration
<button type:string = 'default'
        size: string& = 'md'
        disabled: boolean = false
        click: function@
        color: string number = 'blue'>
    <button class=[
                'btn',
                'btn-' + type,
                'btn-' + size,
                disabled && 'disabled']
            click @= click>
    </button>
</button>

export function button(context) {
    const { argv, data, on } = context;
//   on('click', argv.click);
    
    @on('loaded')
    function () {
        data.c = 100;
        $.get('www.a.com', function (result) {
            data.r = result;
        })
    }
}

// or
export class button {
    constructor(ctx) {
        this.argv = ctx.argv;
        this.data = ctx.data;
    }


}