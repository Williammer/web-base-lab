function isFunction(val) {
  return typeof val === "function";
}

function isPending(promise) {
  return promise["[[PromiseStatus]]"] === "pending";
}

function isFulfilled(promise) {
  return promise["[[PromiseStatus]]"] === "resolved";
}

function isRejected(promise) {
  return promise["[[PromiseStatus]]"] === "rejected";
}

function nextTick(fn) {
  setTimeout(fn, 0);
}

/* these 2 functions are the key processor */
function reject_(promise, error) {
  promise["[[PromiseValue]]"] = error;
  promise["[[PromiseStatus]]"] = "rejected";
  promise._flush();
}
/* these 2 functions are the key processor */
function fulfill_(promise, data) {
  promise["[[PromiseValue]]"] = data;
  promise["[[PromiseStatus]]"] = "resolved";
  promise._flush();
}

class MyPromise {
  static resolve(data) {
    const promise = new this();
    fulfill_(promise, data);
    return promise;
  }

  static reject(error) {
    const promise = new this();
    reject_(promise, error);
    return promise;
  }

  constructor(executor) {
    this["[[PromiseStatus]]"] = "pending";
    this._handlers = [];

    if (isFunction(executor)) {
      try {
        executor(fulfill_.bind(null, this), reject_.bind(null, this));
      } catch (e) {
        reject_(this, e);
      }
    }
  }

  // use as the register function
  then(onFulfilled, onRejected) {
    const nextPromise = new MyPromise();

    if (isPending(this)) {
      this._handlers.push({
        nextPromise,
        onFulfilled,
        onRejected,
      });
      return nextPromise;
    } else {
      this._handle(nextPromise, onFulfilled, onRejected);
      return this;
    }
  }
  catch (onRejected) {
    const nextPromise = new MyPromise();
    if (isPending(this)) {
      this._handlers.push({
        nextPromise,
        onFulfilled: null,
        onRejected,
      });
      return nextPromise;
    } else if (isRejected(this)) {
      this._handle(nextPromise, null, onRejected);
      return this;
    }
  }

  _handle(nextPromise, onFulfilled, onRejected) {
    nextTick(() => {
      try {
        if (isFulfilled(this)) {
          if (isFunction(onFulfilled)) {
            fulfill_(nextPromise, onFulfilled(this["[[PromiseValue]]"]));
          }
        } else if (isRejected(this)) {
          if (isFunction(onRejected)) {
            reject_(nextPromise, onRejected(this["[[PromiseValue]]"]));
          }
        }
      } catch (e) {
        reject_(nextPromise, e);
      }
    });
  }

  _flush() {
    while (this._handlers.length) {
      const {
        nextPromise,
        onFulfilled,
        onRejected
      } = this._handlers.shift();
      this._handle(nextPromise, onFulfilled, onRejected);
    }
  }
}


export default MyPromise;
// export default Promise; // compared with standard Promise