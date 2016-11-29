const Parser = require('./parser.js')
const fs = require('fs')
const { FileNotFound } = require('../def.js')
const { ForMeta, IncludeMeta, IfMeta, DefineMeta } = require('./meta_server.js')
const { DNode, TNode, VNode, ENode } = require('./node_server.js')

function get_i (array_like, index) {
    if (index < 0) 
        index = array_like.length + index
    return array_like[index]
}

const KEY_WORD = "<>/=#\\"

const QUOT = "\'\""

function is_qt (chr) {
    return QUOT.indexOf(chr) != -1
}

function is_kw (chr) {
    return KEY_WORD.indexOf(chr) != -1
}
//compile and return ast
function compile (file) {
    try {
        var data = fs.readFileSync(file, { encoding: 'utf8'})
    } catch (e) {
        throw FileNotFound
    }

    const parser = new Parser(data, file)

    //read a token
    const pt = (stop_at_space = true, ignore_fspace = true, kw = null) => 
                parser.pick_token(stop_at_space, ignore_fspace, kw)
    
    const st = (stop_at_space = true, ignore_fspace = true, kw = null) => 
                parser.seek_token(stop_at_space, ignore_fspace, kw)

    const pick = (ignore_space = true, ignore_breakline = true) =>
                parser.pick(ignore_space, ignore_breakline)

    const seek = (ignore_space = true, ignore_breakline = true) =>
                parser.seek(1, ignore_space, ignore_breakline)

    const err = (what) => parser.error(what)

    parser.set_kw('<>')

    //handle include
    let word = seek(), include_list = []
    while (word == '#') {
        pick()
        if (st(true, false) == 'include') {
            pt(true, false)
            if (seek(true, false) == '<') {
                pick(true, false)
                word = pt()
                if (seek(true, false) == '>') {
                    pick()
                    include_list.push(new IncludeMeta(word))
                    word = seek()
                    continue
                }
            }
            err()
        } else {
            err('unsupported meta')
        }
    }
    //end include

    parser.set_kw(KEY_WORD)
    let stack = [], current_scope = null
    stack.push(current_scope)

    function handle_node(node_constructor) {
        let node, node_name, self_close = false
        pick() // escape '<'
        if (is_kw(seek())) err()
        node_name = word = pt()
        node = new node_constructor(node_name)

        while(seek() != '>') {
            let chr = seek()
            if (chr == '/') {
                pick();
                self_close = true
                continue
            } else if (!is_kw(chr)) {
                word = pt()
                let chr = seek()
                if (chr == '=') {
                    pick()
                    let chr = seek()
                    if (is_qt(chr)) {
                        pick()
                        let value = pt(false, true, chr)
                        node.set_param(word, new TNode(value))
                        pick()
                        continue
                    } else if (!is_kw(chr)) {
                            node.set_param(word, new VNode(pt()))
                            continue
                    }
                } else {
                    node.set_param(word)
                    continue
                }
            }
            err()
        }
        pick() //escape '>'
        if (current_scope !== null) current_scope.push(node)
        if (!self_close) {
            current_scope = node.children
            stack.push(node)
        }
        return node
    }
    //handle define
    let dnode = handle_node(DNode)
    //end define

    while (!parser.eof) {
        word = seek(false, false)
        if (word == '<') {
            if (parser.seek(2) != '/') {
                handle_node(ENode)
                continue
            } else {
                pick(); pick()
                word = pt()
                if (stack.pop().nodeName != word)
                   err('miss match <' + word + '>')
                current_scope = get_i(stack, -1)
                if (current_scope)
                   current_scope = current_scope.children
                if (pick() == '>') continue
            }
        } else if (word == '#') {
            // pick()
            // word = gw()
            // if (word == 'if') {
            //     new IfMeta()
            //     stack..push()
            // } else if (word == 'for') {

            // } else if (word == 'define') {
            //     err('the #define will come soon')
            // } else if (word.startsWith('end')) {
            //     word = word.slice(3)
            // }
        } else {
            word = pt(false, false)
            current_scope.push(new TNode(word))
            continue
        }
        err()
    }
    return dnode
}
console.log(compile('./test.vpp').children[1].children)