export default class VM {
  constructor(context) {
    this._root = document.querySelector(context.el);
    this._data = context.data;
    this._watchers = {};

    this._observe(this._data);
    this._parseNode(this._root);
  }
  _parseNode(root) {
    const children = root.children;

    // Iterate array-like HTMLCollection
    Reflect.apply(Array.prototype.forEach, children, [node => {
      this._parseNode(node);

      const bindDataName = node.getAttribute("bind");
      const modelDataName = node.getAttribute("model");
      // TODO: handle other directives and node type
      if (modelDataName) {
        this._addUpdater(node, "value", modelDataName);

        if (node.tagName === "INPUT") {
          node.addEventListener("input", ({ target: { value } }) => {
            this._data[modelDataName] = value;
          });
        }
      } else if (bindDataName) {
        this._addUpdater(node, "textContent", bindDataName);
      }
    }]);
  }
  _observe(data) {
    const notify = this._notify.bind(this);

    Object.keys(data).forEach((prop) => {
      // use cached value to avoid infinite loop of get/set
      let value = data[prop];

      if (typeof value === "object") {
        this._observe(value);
      }

      Object.defineProperty(data, prop, {
        configurable: true,
        enumerable: true,
        get() {
          // the `this` scope within this descriptor is the target data
          return value;
        },
        set(newValue) {
          value = newValue;
          notify(prop);
        }
      });
    });
  }
  _notify(prop) {
    if (!this._watchers[prop]) {
      return;
    }

    // Updaters is similar to the Dep in Vue
    const updaters = this._watchers[prop];
    updaters.forEach(updater => {
      updater();
    });
  }
  _addUpdater(node, attr, prop) {
    if (!this._watchers[prop]) {
      this._watchers[prop] = [];
    }

    this._watchers[prop].push(this._updater.bind(this, node, attr, prop));
  }
  _updater(node, attr, prop) {
    // TODO: handle deep prop
    node[attr] = this._data[prop];
  }
  get data() {
    return this._data;
  }
}