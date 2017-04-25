import DefaulCls from './DefaultCls';

export default function combine (render_func, cls = DefaultCls) {
    return function (params, content) {
        let instance = new cls(),
        renderer = render_func();
        instance.__renderer__ = renderer;
        renderer.instance = instance;
        renderer.init(params, content);
        return renderer;
    }
}