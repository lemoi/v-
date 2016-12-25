import * as vm from './vm/index';
import * as types from './types/index';
import Component, { create_factory } from './component/index';
var vpp = {
    local: typeof window !== "undefined" ? window : global,
    version: "0.1.0",
    vm, types, Component, create_factory
};

export default vpp;