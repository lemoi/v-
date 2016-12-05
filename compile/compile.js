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

const META = ['for', 'include', 'if', 'elif', 'else', 'endif', 'endfor']

const KEY_WORD_INCLUDE = '<>'
const KEY_WORD_NODE = '<>=/'
const KEY_WORD_TEXT = '#<>\\'
const KEY_WORD_NORMAL_META = ''

const QUOT = "\'\""

const REG_VARIABLE = /^[\$_a-zA-Z][\$\w_]*$/

function is_vaild_var(variable) {
    return REG_VARIABLE.test(variable)
}

function is_qt (chr) {
    return QUOT.indexOf(chr) != -1
}
//just use for node parse
function is_kw (chr) {
    return KEY_WORD_NODE.indexOf(chr) != -1
}

function is_meta (w) {
    return META.indexOf(w) != -1
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

    parser.set_kw(KEY_WORD_INCLUDE)

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

    let stack = [], current_scope = null
    stack.children = stack
    stack.push(stack)

    function handle_node (node_constructor) {
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

    function handle_meta () {
        let meta = st()
        if (meta == 'define') {
            pt()
            let field = st()
            if (is_vaild_var(field)) {
                pt()
                let def = new DefineMeta(field, pt())
                current_scope.push(def)
                current_scope = def.scope
                return
            }
        } else if (meta == 'for') {
            pt()
            let field = st(true, true, [','])
            if (is_vaild_var(field)) {
                pt(true, true, [','])
                if (seek() == ',') {
                    pick()
                    if (is_vaild_var(st()))
                        field = [field, pt()]
                    else
                        err()
                }
                if (st() == 'in') {
                    pt()
                    let f = new ForMeta(field, pt(false, true, Parser.LE))
                    current_scope.push(f)
                    current_scope = f.scope
                    stack.push(f)
                    return
                }
            }
        } else if (meta == 'if') {
            pt()
            let i = new IfMeta(pt(false, true, Parser.LE))
            current_scope.push(i)
            current_scope = i.scope
            stack.push(i)
            return    
        } else if (meta == 'else') {
            let i = get_i(stack, -1)
            if ('metaName' in i && i.metaName == 'if') {
                pt()
                i.add_branch()
                current_scope = i.scope
                return
            } else {
                err('error else')
            }
        } else if (meta == 'elif') {
            let i = get_i(stack, -1)
            if ('metaName' in i && i.metaName == 'if') {
                pt()
                i.add_branch(pt(false, true, Parser.LE))
                current_scope = i.scope
                return
            } else {
                err('error elif')
            }
        } else if (meta == 'endif') {
            let i = stack.pop()
            if ('metaName' in i && i.metaName == 'if') {
                pt()
                reset_current_scope()
                return
            } else {
                err('miss match endif')
            }            
        } else if (meta == 'endfor') {
            let f = stack.pop()
            if ('metaName' in f && f.metaName == 'for') {
                pt()
                reset_current_scope()
                return
            } else {
                err('miss match endfor')
            }        
        } else if (meta == 'include') {
            err('not allowed include')
        }
        err()
    }

    function reset_current_scope () {
        let parent = get_i(stack, -1)
        current_scope = 'children' in parent ? parent.children : parent.scope
    }

    //handle define
    let dnode = handle_node(DNode)
    //end define

    while (!parser.eof) {
        word = seek(false, false)
        if (word == '\\') {
            pick()
            current_scope.push(new TNode(pick(false, false)))
            continue
        } else if (word == '<') {
            parser.set_kw(KEY_WORD_NODE)
            if (parser.seek(2) != '/') {
                handle_node(ENode)
                continue
            } else {
                pick(); pick()
                word = pt()
                let node = stack.pop()
                if ('nodeName' in node && node.nodeName == word)
                    reset_current_scope()
                else
                    err('miss match ' + word)
                if (pick() == '>') continue
            }
        } else if (word == '#') {
            pick()
            parser.set_kw(KEY_WORD_NORMAL_META)
            if (is_vaild_var(seek(false, false))) {
                if (is_meta(st())) {
                    handle_meta()
                    continue
                } else {
                    let v = pt(true, false, '#')
                    if (is_vaild_var(v) && seek(false, false) == '#') {
                        current_scope.push(new VNode(v))
                        pick()
                        continue
                    }
                }
            }
        } else {
            parser.set_kw(KEY_WORD_TEXT)
            word = pt(false, false)
            current_scope.push(new TNode(word))
            continue
        }
        err()
    }
    return [include_list, dnode]
}

module.exports = compile