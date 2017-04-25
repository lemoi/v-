import * as renderer from './renderer/index';
import * as types from './types/index';
import Component from './component/index';
import combine from '../utils/combine';

var vpp = {
    local: typeof window !== "undefined" ? window : global,
    version: "0.1.0", types,
    renderer, Component, combine
};

export default vpp;