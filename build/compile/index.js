const Parser = require('./parser');
const { NotImplement } = require('../error_static');
const { ForMeta, IncludeMeta, IfMeta, DefineMeta } = require('./meta');
const { DNode, TNode, VNode, ENode } = require('./node');
const { TString, TNumber, TVariable } = require('./expression');

function get_i (array_like, index) {
    if (index < 0) 
        index = array_like.length + index;
    return array_like[index];
}

const META = ['for', 'include', 'if', 'elif', 'else', 'endif', 'endfor', 'define', 'comment'];

const KEY_WORD_INCLUDE = '<>';
const KEY_WORD_NODE = '<>=/';
const KEY_WORD_TEXT = '#<>\\';
const KEY_WORD_NORMAL_META = '';

const QUOT = "\'\"";

const REG_VARIABLE = /^[\$_a-zA-Z][\$\w_]*$/;
const REG_NUMBER = /^\d+$/;
const KEY_WORD_EXPRESSION = ':?="\'()+-*/.{}[]#,&|!~<>';

function is_vaild_var (token){
    return REG_VARIABLE.test(token);
}

function is_vaild_number (token) {
    return REG_NUMBER.test(token);
}

function is_qt (chr) {
    return QUOT.indexOf(chr) != -1;
}
//just use for node parse
function is_kw (chr) {
    return KEY_WORD_NODE.indexOf(chr) != -1;
}

function is_meta (w) {
    return META.indexOf(w) != -1;
}

function is_e_kw (chr) {
    return KEY_WORD_EXPRESSION.indexOf(chr) != -1;
}

//compile and return ast
function compile (str, filename) {

    const parser = new Parser(str, filename);

    //pick a token
    const pt = (stop_at_space = true, ignore_fspace = true, kw = null) => 
                parser.pick_token(stop_at_space, ignore_fspace, kw);
    
    const st = (stop_at_space = true, ignore_fspace = true, kw = null) => 
                parser.seek_token(stop_at_space, ignore_fspace, kw);

    const pick = (ignore_space = true, ignore_breakline = true) =>
                parser.pick(ignore_space, ignore_breakline);

    const seek = (ignore_space = true, ignore_breakline = true) =>
                parser.seek(1, ignore_space, ignore_breakline);

    const err = (what) => parser.error(what);

    //pick string
    const ps = function (chr) {
        let t = pt(false, false, chr), buffer = [t];
        while (get_i(t, -1) == '\\' && get_i(t, -2) != '\\') {
            pick();
            t = pt(false, false, chr);
            buffer.push(chr, t);
        }
        return buffer.join('');
    }

    //pick expression and tokenize 
    const pe = function (end) {
        let buffer = [], token;
        while (true) {
            let k = seek(true, false);
            if (end.indexOf(k) != -1) {
                break;
            } else if (is_qt(k)){
                pick();
                buffer.push(new TString(ps(k)));
                pick();
            } else if (k == '{'){
                pick();
                buffer.push(k);
                if (is_qt(seek())) continue;
                buffer.push(new TString(pt(true, true, KEY_WORD_EXPRESSION)))
                if (seek() != ':') err();
            } else if (is_e_kw(k)) {
                pick();
                buffer.push(k);
            } else {
                token = pt(true, true, KEY_WORD_EXPRESSION);
                if (is_vaild_number(token))
                    buffer.push(new TNumber(token));
                else if (is_vaild_var(token)) {
                    while (seek(false, false) == '.') {
                        pick();
                        let t = pt(true, true, KEY_WORD_EXPRESSION);
                        if(is_vaild_var(t))
                            token += ('.' + t);
                        else 
                            err();
                    }
                    buffer.push(new TVariable(token));
                } else 
                    err();
            } 
        }
        return buffer;
    }

    parser.set_kw(KEY_WORD_INCLUDE);

    //handle include
    let word = seek(), include_list = [];
    while (word == '#') {
        pick();
        if (pt(true, false) == 'include') {
            if (pick(true, false) == '<') {
                word = pt();
                let alias = null;
                if (st(true, true, '') == '=>') {
                    pt(true, true, '');
                    alias = pt();
                }
                if (pick(true, false) == '>') {
                    include_list.push(new IncludeMeta(word, alias));
                    word = seek();
                    continue;
                }
            }
            err();
        } else {
            err('unsupported meta');
        }
    }
    //end include

    let stack = [], current_scope = null;
    stack.children = stack;
    stack.push(stack);

    function handle_node (is_dnode = false) {
        let node, node_name, self_close = false;
        pick(); // escape '<'
        if (is_kw(seek())) err();
        node_name = word = pt();
        if (is_dnode) 
            node = new DNode(node_name);
        else 
            node = new ENode(node_name);
        while(seek() != '>') {
            let chr = seek();
            if (chr == '/') {
                pick();;
                self_close = true;
                continue
            } else if (!is_kw(chr)) {
                word = pt();
                let chr = seek();
                if (chr == '=') {
                    pick();
                    let chr = seek();
                    if (is_qt(chr)) {
                        pick();
                        node.set_param(word, new TNode(ps(chr)));
                        pick();
                    } else if (chr == '#') {
                        pick();
                        node.set_param(word, new VNode(pe('#')));
                        pick();
                    } else if (!is_kw(chr)) {
                        let token = pt();
                        if (is_vaild_var(token))
                            node.set_param(word, new VNode([new TVariable(token)]));
                        else if (is_vaild_number(token))
                            node.set_param(word, token);
                        else
                            err();
                    }
                    continue;
                } else {
                    if (is_dnode) node.set_param(word);
                    else node.set_param(word, 'true'); 
                    continue;
                }
            }
            err();
        }
        pick(); //escape '>'
        if (current_scope !== null) current_scope.push(node);
        if (!self_close) {
            current_scope = node.children;
            stack.push(node);
        }
        return node;
    }

    function handle_meta () {
        let meta = pt();
        if (meta == 'define') {
            let field = pt();
            if (is_vaild_var(field)) {
                let def = new DefineMeta(field, new VNode(pe(Parser.LE)));
                current_scope.push(def);
                current_scope = def.children;
                return;
            }
        } else if (meta == 'for') {
            let field = pt(true, true, [',']);
            if (is_vaild_var(field)) {
                if (pick() == ',') {
                    let t = pt();
                    if (is_vaild_var(t))
                        field = [field, t];
                    else
                        err();
                } else {
                    field = [field];
                }
                if (pt() == 'in') {
                    let f = new ForMeta(field, new VNode(pe(Parser.LE)));
                    current_scope.push(f);
                    current_scope = f.children;
                    stack.push(f);
                    return;
                }
            }
        } else if (meta == 'if') {
            let i = new IfMeta(new VNode(pe(Parser.LE)));
            current_scope.push(i);
            current_scope = i.children;
            stack.push(i);
            return;
        } else if (meta == 'else') {
            let i = get_i(stack, -1);
            if ('metaName' in i && i.metaName == 'if') {
                i.add_branch();
                current_scope = i.children;
                return;
            } else {
                err('error else');
            }
        } else if (meta == 'elif') {
            let i = get_i(stack, -1);
            if ('metaName' in i && i.metaName == 'if') {
                i.add_branch(new VNode(pe(Parser.LE)));
                current_scope = i.children;
                return;
            } else {
                err('error elif');
            }
        } else if (meta == 'endif') {
            let i = stack.pop();
            if ('metaName' in i && i.metaName == 'if') {
                reset_current_scope();
                return;
            } else {
                err('miss match endif');
            }            
        } else if (meta == 'endfor') {
            let f = stack.pop();
            if ('metaName' in f && f.metaName == 'for') {
                reset_current_scope();
                return;
            } else {
                err('miss match endfor');
            }        
        } else if (meta == 'include') {
            err('not allowed include');
        } else if (meta == 'comment') {
            parser.save();
            pt(false, false, '#');
            pick();
            meta = pt();
            try {
                while (meta != 'end') {
                    pt(false, false, '#');
                    pick();
                    meta = pt();
                }
            } catch (e) {
                parser.restore();
                err('unclosed comment');
            }
            parser.clear();
            if (Parser.is_le(seek(true, false)))
                return;
        }
        err();
    }

    function reset_current_scope () {
        current_scope = get_i(stack, -1).children;
    }

    //handle define
    let ast = handle_node(true);
    //end define

    while (!parser.eof) {
        word = seek(false, false);
        if (word == '<') {
            parser.set_kw(KEY_WORD_NODE);
            if (parser.seek(2) != '/') {
                handle_node();
                continue;
            } else {
                pick(); pick();
                word = pt();
                let node = stack.pop();
                if ('nodeName' in node && node.nodeName == word)
                    reset_current_scope();
                else
                    err('miss match ' + word);
                if (pick() == '>') continue;
            }
        } else if (word == '#') {
            pick();
            parser.set_kw(KEY_WORD_NORMAL_META);
            if (is_meta(st())) {
                handle_meta();
                continue;
            } else {
                current_scope.push(new VNode(pe('#')));
                pick();
                continue;
            }
        } else {
            parser.set_kw(KEY_WORD_TEXT);
            let str = pt(false, false);
            while (seek(false, false) == '\\') {
                pick(false, false);
                str += pick(false, false);
                str += pt(false, false);
            }
            str = str.trim();
            if (str.length > 0)
                current_scope.push(new TNode(str));
            continue;
        }
        err();
    }
    return [include_list, ast];
}

module.exports = compile;