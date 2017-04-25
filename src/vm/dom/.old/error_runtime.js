export const VReferenceError = (component, which) =>
    new Error(which + 'is not defined in ' + component);

export const VTypeError = (component, arg) =>
    new Error('Invaild argument type of ' + arg + ' passed to ' + component);

export const VArgumentError = (component, arg, few) =>
    new Error((few ? 'too few' : 'too many') +
    ' arguments to ' + component + ' -> ' + arg);
