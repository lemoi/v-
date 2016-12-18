var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};









var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};



var set = function set(object, property, value, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent !== null) {
      set(parent, property, value, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    desc.value = value;
  } else {
    var setter = desc.set;

    if (setter !== undefined) {
      setter.call(receiver, value);
    }
  }

  return value;
};

var Card = function (_Component) {
    inherits(Card, _Component);

    function Card() {
        classCallCheck(this, Card);
        return possibleConstructorReturn(this, (Card.__proto__ || Object.getPrototypeOf(Card)).call(this));
    }

    return Card;
}(Component);

function _$_Card_vm() {
    return new ViewModel({
        name: null
    }, ["\n    ", new Element("div", [new Value(function () {
        return this.get("name");
    })]), "\n"]);
}

var _$_Card_f = factory_helper(Card, _$_Card_vm);

var showcases = function (_Component) {
    inherits(showcases, _Component);

    function showcases() {
        classCallCheck(this, showcases);
        return possibleConstructorReturn(this, (showcases.__proto__ || Object.getPrototypeOf(showcases)).call(this));
    }

    return showcases;
}(Component);

function _$_showcases_vm() {
    return new ViewModel(["\n", new For("i", new Value(function () {
        return [1, 2, 3];
    }), ["\n", _$_Card_f({
        name: new Value(function () {
            return this.get("i");
        })
    }), "\n"]), "\n"]);
}

var _$_showcases_f = factory_helper(showcases, _$_showcases_vm);

export { _$_showcases_f };
