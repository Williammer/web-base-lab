function fulfill(data) {
  this["[[PromiseValue]]"] = data;
  this["[[PromiseStatus]]"] = "resolved";
}
function reject(error) {
  this["[[PromiseValue]]"] = error;
  this["[[PromiseStatus]]"] = "rejected";
}

class MyPromise {
  static resolve(data) {
    const promise = new this();
    fulfill.call(promise, data);
    return promise;
  }

  static reject(error) {
    const promise = new this();
    reject.call(promise, error);
    return promise;
  }

  constructor(executor) {
    this["[[PromiseStatus]]"] = "pending";

    if (typeof executor === "function") {
      try {
        executor(fulfill.bind(this), reject.bind(this));
      } catch(e) {
        reject.call(this, e);
      }
    }
  }

  then(onFufilled, onRejected) {
    setTimeout(() => {
      typeof onFufilled === "function" && onFufilled(this["[[PromiseValue]]"]);
    }, 0);
    return this;
  }

  catch(onRejected) {
    setTimeout(() => {
      typeof onRejected === "function" && onRejected(this["[[PromiseValue]]"]);
    }, 0);
    return this;
  }
}


export default MyPromise;
// export default Promise; // compared with standard Promise
