export default class VM {
  constructor(context) {
    const parent = document.querySelector(context.el);
    this._watchers = [];
    this._data = context.data;

    this._initObservers();
    this._parseView(parent);
  }
  _parseView(parent) {
    const children = parent.children;

    // Iterate array-like HTMLCollection
    Reflect.apply(Array.prototype.forEach, children, [node => {
      const bindedData = node.getAttribute("bind");
      const modelledData = node.getAttribute("model");
      if (modelledData) {
        this._watchers.push({ [modelledData]: this._modelHandler.bind(this, node) });
      } else if (bindedData) {
        this._watchers.push({ [bindedData]: this._bindHandler.bind(this, node) });
      }
    }]);

    console.log("this._watchers: ", this._watchers);
  }
  _initObservers() {
    const propNames = Object.keys(this._data);
    this._initObserver = this._initObserver.bind(this);
    propNames.forEach(this._initObserver);
  }
  _initObserver(propName) {
    // use cached value to avoid infinite loop of get/set
    let value = this._data[propName];
    const notify = this._notify.bind(this);

    Object.defineProperty(this._data, propName, {
      configurable: true,
      enumerable: true,
      get() {
        // the `this` scope within this descriptor is the target data
        return value;
      },
      set(newValue) {
        value = newValue;

        notify(propName);
      }
    });
  }
  _notify(propName) {
    this._watchers.forEach((watcher) => {
      watcher[propName](propName); // invoke the handler
    })
  }

  _bindHandler(node, propName) {
    console.log("called _bindHandler");
    // handle how to update the `bind` elements
    node.textContent = this._data[propName];
  }

  _modelHandler(node, propName) {
    console.log("called _modelHandler");
    // handle how to update the `bind` elements
    node.value = this._data[propName];
  }

  get data() {
    return this._data;
  }
}