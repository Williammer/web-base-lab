




// const vmCore = 






export default class VM {
  constructor(context) {
    const blockElement = document.querySelector("#scope-block");
    this._data = context.data;
    this._initObserver()
  }

  _initObserver() {
    const initVal = this._data.prop;
    const propNames = Object.keys(this._data);
    propNames.forEach((prop) => {
      Object.defineProperty(this._data, prop, {
        // writable: true,
        configurable: true,
        enumerable: true,
        // value: initVal,
        get() {
          return this._data[prop];
        },
        set(value) {
          this._data[prop] = value;
          // notify watchers
          
        }
      }
    });
  }
}