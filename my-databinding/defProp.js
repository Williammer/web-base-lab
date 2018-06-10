export default function defProp (data, notifier) {
  Object.keys(data).forEach((prop) => {
    // use cached value to avoid infinite loop of get/set
    let value = data[prop];

    if (typeof value === "object") {
      defProp(value);
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
        notifier(prop);
      }
    });
  });

  return data;
}