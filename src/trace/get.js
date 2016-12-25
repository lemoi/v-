export default function get (root, traces) {
    let target = root;
    traces.forEach(function (p) {
        target = target[p];
    });
    return target;
}