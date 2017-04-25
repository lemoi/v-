function type_sheck (obj, type) {
    return Object.prototype.toString.call(obj) == '[object ' + type + ']';
}

export const number = (obj) => type_sheck(obj, 'Number');
export const string = (obj) => type_sheck(obj, 'String');
export const bool = (obj) => type_sheck(obj, 'Boolean');
export const array = (obj) => type_sheck(obj, 'Array');
export const func = (obj) => type_sheck(obj, 'Function');
export const symbol = (obj) => type_sheck(obj, 'Symbol');
export const object = (obj) => type_sheck(obj, 'Object');