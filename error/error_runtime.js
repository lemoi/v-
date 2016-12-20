const VReferenceError = (component, which) => new Error(which + 'is not defined in ' + component)

const VTypeError = (component, param) => new Error('Invaild parameter '+ param +' passed to ' + component)

exports = { VReferenceError, VTypeError }