export default function proxy (data, notifier) {
  return new Proxy(data, {
    get(target, prop) {
      return target[prop];
    },
    set(target, prop, newValue) {
      target[prop] = newValue;
      notifier(prop);

      return true;
    },
  });
}