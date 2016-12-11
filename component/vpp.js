class Vpp {
    constructor () {
        this.__oldData__ = Object.create(null)
    }

    __change__ (old_data) {
        for (let i in this) {
            if (i.slice(2) == '__' && 
                i.slice(-2) == '__' &&
                i != '__proto__')
                continue;
            if (this[i] !== this.__oldData__[i])
                return true;
        }
        return false;
    }

    __didLoad__ () {

    }

    __didUnload__ () {

    }

    __update__ () {
        this.__v__.update()
    }

    update () {
        this.__update__()
    }
}