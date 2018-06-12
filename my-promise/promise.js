function isFunction(val) {
  return typeof val === "function";
}

function isPromise(promise) {
  return promise instanceof MyPromise;
}

function isPending(promise) {
  return promise["[[PromiseStatus]]"] === "pending";
}

function isResolved(promise) {
  return promise["[[PromiseStatus]]"] === "resolved";
}

function isRejected(promise) {
  return promise["[[PromiseStatus]]"] === "rejected";
}

function dummyFn() {
  return () => {};
}

function nextTick(fn) {
  setTimeout(fn, 0);
}

function _update(method, promise, data) {
  if (isPromise(data)) {
    return data.then(
      resolvedData => {
        _fulfill(promise, resolvedData);
      },
      rejectedData => {
        _reject(promise, rejectedData);
      }
    );
  }

  promise["[[PromiseValue]]"] = data;
  promise["[[PromiseStatus]]"] = method;
  promise._flush();
}
function _fulfill(promise, data) {
  return _update("resolved", promise, data);
}
function _reject(promise, error) {
  return _update("rejected", promise, error);
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
    this["[[PromiseStatus]]"] = "pending";
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

  // use as the register function
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
      // promise fallover
      return this;
    }

    this._handle(this, nextPromise, onFulfilled, onRejected);
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
      // promise fallover
      return this;
    }

    this._handle(this, nextPromise, null, onRejected);
    return nextPromise;
  }
  /*
   * The Atomic async handling function
   */
  _handle(context, nextPromise, onFulfilled, onRejected) {
    nextTick(() => {
      try {
        const value = context["[[PromiseValue]]"];
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

  _flush() {
    let context = this;
    while (this._deferredHandlers.length) {
      const {
        nextPromise,
        onFulfilled,
        onRejected
      } = this._deferredHandlers.shift();

      this._handle(context, nextPromise, onFulfilled, onRejected);
      context = nextPromise;
    }
  }
}

export default MyPromise;
// export default Promise; // compared with standard Promise
