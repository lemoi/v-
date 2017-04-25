import Value from '../renderer/Value';
import get from './get';

const ip = Value.instance_map;
const dep = '$.$';
export default function observe () {
    const root = {};

    function add (uid, traces) {
        let target = root;
        traces.forEach(function (p) {
            if (target.hasOwnProperty(p))
                target = target[p];
            else {
                target = target[p] = {};
            }
        });
        if (!target.hasOwnProperty(dep))
            target[dep] = new Set();
        target[dep].add(uid);
    }

    function spread (current, operation) {
        for (let i in current) {
            let t = current[i];
            if (i == dep && t.size) {
                t.forEach(function (uid) {
                    if (ip.hasOwnProperty(uid))
                        ip[uid].update(operation);
                    else
                        t.delete(uid); //gc
                });
            } else {
                spread(t, operation);
            }
        }
    }

    function notify (traces, operation) {
        try {
            spread(get(root, traces), operation);
        } catch (e) {
            return false;
        }
    }

    return { add, notify };
}
