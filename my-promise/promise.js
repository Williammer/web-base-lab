const STATUS = Symbol.for("[[PromiseStatus]]");
const VALUE = Symbol.for("[[PromiseValue]]");

function isFunction(val) {
  return typeof val === "function";
}
function isPromise(promise) {
  return promise instanceof MyPromise;
}
function isPending(promise) {
  return promise[STATUS] === "pending";
}
function isResolved(promise) {
  return promise[STATUS] === "resolved";
}
function isRejected(promise) {
  return promise[STATUS] === "rejected";
}
function dummyFn() {
  return () => {};
}
function nextTick(fn) {
  setTimeout(fn, 0);
}

function _update(method, promise, data) {
  if (isPromise(data)) {
    const updater = _update.bind(null, method, promise);
    return data.then(updater, updater);
  }

  promise[VALUE] = data;
  promise[STATUS] = method;
  _flush(promise);
}
function _fulfill(promise, data) {
  return _update("resolved", promise, data);
}
function _reject(promise, error) {
  return _update("rejected", promise, error);
}
function _handle(context, nextPromise, onFulfilled, onRejected) {
  nextTick(() => {
    try {
      const value = context[VALUE];
      if (isResolved(context)) {
        if (isFunction(onFulfilled)) {
          _fulfill(nextPromise, onFulfilled(value));
        }
      } else if (isRejected(context)) {
        if (isFunction(onRejected)) {
          _fulfill(nextPromise, onRejected(value));
        }
      }
    } catch (e) {
      _reject(nextPromise, e);
    }
  });
}
function _flush(promise) {
  let curPromise = promise;
  while (promise._deferredHandlers.length) {
    const {
      nextPromise,
      onFulfilled,
      onRejected
    } = promise._deferredHandlers.shift();

    _handle(curPromise, nextPromise, onFulfilled, onRejected);
    curPromise = nextPromise;
  }
}

class MyPromise {
  static resolve(data) {
    const promise = new MyPromise(dummyFn);
    _fulfill(promise, data);
    return promise;
  }

  static reject(error) {
    const promise = new MyPromise(dummyFn);
    _reject(promise, error);
    return promise;
  }

  constructor(executor) {
    this[STATUS] = "pending";
    this._deferredHandlers = [];

    if (!isFunction(executor)) {
      throw new TypeError("Promise resolver undefined is not a function");
    }

    try {
      executor(_fulfill.bind(null, this), _reject.bind(null, this));
    } catch (e) {
      _reject(this, e);
    }
  }

  then(onFulfilled, onRejected) {
    const nextPromise = new MyPromise(dummyFn);

    if (isPending(this)) {
      this._deferredHandlers.push({
        nextPromise,
        onFulfilled,
        onRejected
      });
      return this;
    }
    if (!isResolved(this) && !isFunction(onRejected)) {
      // fallover this then
      return this;
    }

    _handle(this, nextPromise, onFulfilled, onRejected);
    return nextPromise;
  }

  catch(onRejected) {
    const nextPromise = new MyPromise(dummyFn);

    if (isPending(this)) {
      this._deferredHandlers.push({
        nextPromise,
        onFulfilled: null,
        onRejected
      });
      return this;
    }
    if (!isRejected(this)) {
      // fallover this catch
      return this;
    }

    _handle(this, nextPromise, null, onRejected);
    return nextPromise;
  }
}

export default MyPromise;
