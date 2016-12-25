import DefaultModel from './DefaultModel';

export default function create_factory (vm_constructor, m_constructor = DefaultModel) {
    return function (params) {
        let m = new m_constructor();
        let vm = new vm_constructor();
        m.__vm__ = vm;
        vm.__m__ = m;
        m.__beforeLoad__();
        vm.init(params);
        return vm;
    }
}