function is_str (obj) {
    return typeof obj == 'string';
}

/* the poh is an abbreviation for the parent or host */

function set_parent (children, parent) {
    if (children === null) return;
    for (let child of children) {
        if (is_str(child))
            continue;
        child.poh = parent;
    }
}

function set_host (params, host) {
    if (params === null) return;
    for (let k in params) {
        if (params[k] instanceof Value) {
            params[k].poh = host;
        }
    }
}

module.exports = { is_str, set_parent, set_host };