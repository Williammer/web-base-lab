export default class VM {
  constructor(context) {
    this._root = document.querySelector(context.el);
    this._watchers = [];
    this._data = context.data;

    this._observe(this._data);
    this._parseView(this._root);
  }
  _parseView(root) {
    const children = root.children;

    // Iterate array-like HTMLCollection
    Reflect.apply(Array.prototype.forEach, children, [node => {
      const bindDataName = node.getAttribute("bind");
      const modelDataName = node.getAttribute("model");
      if (modelDataName) {
        this._watchers.push({ [modelDataName]: this._modelHandler.bind(this, node) });

        node.addEventListener("input", ({ target: { value } }) => {
          this._data[modelDataName] = value;
        });
      } else if (bindDataName) {
        this._watchers.push({ [bindDataName]: this._bindHandler.bind(this, node) });
      }
    }]);
  }
  _observe(data) {
    const notify = this._notify.bind(this);

    Object.keys(data).forEach((propName) => {
      // use cached value to avoid infinite loop of get/set
      let value = data[propName];

      if (typeof value === "object") {
        this._observe(value);
      }

      Object.defineProperty(data, propName, {
        configurable: true,
        enumerable: true,
        get() {
          // the `this` scope within this descriptor is the target data
          return value;
        },
        set(newValue) {
          value = newValue;
          notify(propName); // TODO: change it to have each Watcher
        }
      });
    });
  }
  _notify(propName) {
    this._watchers.forEach((watcher) => {
      watcher[propName](propName); // invoke the mutation handler
    })
  }
  _bindHandler(node, propName) {
    node.textContent = this._data[propName];
  }
  _modelHandler(node, propName) {
    node.value = this._data[propName];
  }
  get data() {
    return this._data;
  }
}