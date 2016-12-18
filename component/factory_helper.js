export function factory_helper (m_constructor, vm_constructor) {
    return function () {
        let m = new m_constructor();
        let vm = new vm_constructor();
        m.__vm__ = vm;
        vm.__m__ = m;
        return m;
    }
}