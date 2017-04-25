const str = `import { card } from './card.vx';

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
}`;
const utils = require('../utils')
test('split correctly', () => {
    const collection = utils.preprocess(str);
    console.log(collection.length)
    for (let name of collection) {
        console.log(name)
    }
})