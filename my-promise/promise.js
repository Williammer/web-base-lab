const PENDING = Symbol.for("pending");
const RESOLVED = Symbol.for("resolved");
const REJECTED = Symbol.for("rejected");

function isFunction(val) {
  return typeof val === "function";
}
function isPending(promise) {
  return promise["[[PromiseStatus]]"] === PENDING;
}
function isFulfilled(promise) {
  return promise["[[PromiseStatus]]"] === RESOLVED;
}
function isRejected(promise) {
  return promise["[[PromiseStatus]]"] === REJECTED;
}

function nextTick(fn) {
  const tick = setTimeout(() => {
    fn();
    clearTimeout(tick);
  }, 0);
}


/* these 2 functions are the key processor */
function fulfill_(data) {
  this["[[PromiseValue]]"] = data;
  this["[[PromiseStatus]]"] = RESOLVED;

  this._handlers.reduce((accu, handler, index) => {
    if (handler.type !== RESOLVED) {
      return accu;
    }

    // make async?
    return handler(accu);
  }, data);
}
/* these 2 functions are the key processor */
function reject_(error) {
  this["[[PromiseValue]]"] = error;
  this["[[PromiseStatus]]"] = REJECTED;

  this._handlers.reduce((accu, handler, index) => {
    if (handler.type !== REJECTED) {
      return accu;
    }

    // make async?
    return handler(accu);
  }, error);
}


class MyPromise {
  static resolve(data) {
    const promise = new this();
    fulfill_.call(promise, data);
    return promise;
  }

  static reject(error) {
    const promise = new this();
    reject_.call(promise, error);
    return promise;
  }

  constructor(executor) {
    this["[[PromiseStatus]]"] = PENDING;
    this._handlers = [];

    if (isFunction(executor)) {
      try {
        executor(fulfill_.bind(this), reject_.bind(this));
      } catch(e) {
        reject_.call(this, e);
      }
    }
  }

  // use as the register function
  then(onFulfilled, onRejected) {
    if (isFunction(onFulfilled)) {
      onFulfilled.type = RESOLVED;
      this._handlers.push(onFulfilled);
    }
    if (isFunction(onRejected)) {
      onFulfilled.type = REJECTED;
      this._handlers.push(onRejected);
    }

    return this;
  }

  catch(onRejected) {
    if (isFunction(onRejected)) {
      this._handlers.push({ REJECTED: onRejected });
    }

    return this;
  }
}


export default MyPromise;
// export default Promise; // compared with standard Promise
