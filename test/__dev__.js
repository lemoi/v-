
const str = `
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

<div>

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
`;

const regex = /(?:)<([^\/\s]+)[^]*?>[^]*<\/\1\s*>/g;

console.log(str.replace(regex, function (match) {
    console.log('match start');
    console.log(match);
    console.log('match end')
    return '';
}))


function split(source) {
    const parts = {};
    const startRegex = /<([^>\s\/]+)[^>]*>/g;
    let startMatch = startRegex.exec(source);
    while (startMatch !== null) {
        const name = startMatch[1];
        const stack = [name];
        const stopRegex = new RegExp('<(' + name + ')[^>/]*>|</(' + name + ')[^>]*>', 'g');

        stopRegex.lastIndex = startRegex.lastIndex;
        let stopMatch = stopRegex.exec(source);
        const pos = startMatch.index + startMatch[0].length;
        let lasted = pos;
        while (stopMatch !== null) {

            if (stopMatch[1] === undefined) {
                stack.pop();
                lasted = stopMatch.index + stopMatch[0].length;
                if (stack.length === 0) {
                    break;
                }
            } else {
                stack.push(name);
            }
            stopMatch = stopRegex.exec(source);
        }

        if (stopMatch === null) {
            if (lasted !== pos) {
                parts[startMatch[1]] = [startMatch.index, lasted];
            }
            startRegex.lastIndex = lasted;
        } else {
            parts[startMatch[1]] = [startMatch.index, stopMatch.index + stopMatch[0].length];
            startRegex.lastIndex = stopRegex.lastIndex;
        }

        startMatch = startRegex.exec(source)
    }
    
    return parts;
}

const res = split(str);
console.log(res)
for (let i in res) {
    console.log()
    console.log(str.slice(res[i][0], res[i][1]))
}