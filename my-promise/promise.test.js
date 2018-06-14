import MyPromise from "./promise";

describe("Promise tests", () => {
  describe("Promise shape", () => {
    it("should return an instance of the Promise", () => {
      const resolver = jest.fn();

      const promise = new MyPromise(resolver);
      expect(promise).toBeInstanceOf(MyPromise);
      expect(promise.constructor).toBe(MyPromise);
    });

    it("should exec the resolver function of the new Promise instantly", () => {
      const resolver = jest.fn();

      new MyPromise(resolver);
      expect(resolver).toHaveBeenCalledTimes(1);
    });

    it("should throw if the resolver passed for the Promise is not function", () => {
      const badResolvers = [undefined, null, {}, [], "str", 123];
      badResolvers.forEach(resolver => {
        expect(() => {
          new MyPromise(resolver);
        }).toThrow();
      });
    });

    it("should have property of then from promise instance", () => {
      const resolver = jest.fn();

      const promise = new MyPromise(resolver);
      expect(promise.then).toBeInstanceOf(Function);
    });

    describe("Not required from Promise/A+", () => {
      it("should have static property of resolve and reject from Promise constructor", () => {
        expect(MyPromise.resolve).toBeInstanceOf(Function);
        expect(MyPromise.reject).toBeInstanceOf(Function);
      });

      it("should have property of catch from promise instance", () => {
        const resolver = jest.fn();

        const promise = new MyPromise(resolver);
        expect(promise.catch).toBeInstanceOf(Function);
      });
    });
  });

  describe("Promise behaviors", () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });
    afterEach(() => {
      jest.clearAllTimers();
    });

    it("should return a new promise for then from promise instance", () => {
      const resolver = jest.fn();

      const promise1 = new MyPromise(resolver);
      expect(promise1.then()).toBeInstanceOf(MyPromise);
    });

    it("the onFulfilled/onRejected callbacks of then should receive the value/error of the promise when invoked", () => {
      const data = "data";
      const error = new Error("error");
      const resolveExecutor = (resolve, reject) => {
        return resolve(data);
      };
      const rejectExecutor = (resolve, reject) => reject(error);
      const resolver = jest.fn(val => {
        return val;
      });
      const rejector = jest.fn();
      const promise1 = new MyPromise(resolveExecutor);
      const promise2 = new MyPromise(rejectExecutor);

      promise1.then(resolver);
      jest.advanceTimersByTime(100);
      expect(resolver).toHaveBeenCalledTimes(1);
      expect(resolver).toHaveBeenCalledWith(data);

      resolver.mockReset();

      promise2.then(resolver, rejector);
      jest.advanceTimersByTime(100);
      expect(resolver).toHaveBeenCalledTimes(0);
      expect(rejector).toHaveBeenCalledTimes(1);
      expect(rejector).toHaveBeenCalledWith(error);
    });

    it("should invoke onRejected of then when promise is rejected by error", () => {
      const error = new Error("error");
      const onFufilled = jest.fn();
      const onRejected = jest.fn();
      new MyPromise(() => {
        throw error;
      }).then(onFufilled, onRejected);
      jest.advanceTimersByTime(100);

      expect(onFufilled).toHaveBeenCalledTimes(0);
      expect(onRejected).toHaveBeenCalledTimes(1);
      expect(onRejected).toHaveBeenCalledWith(error);
    });

    it("should chain then for resolved case", () => {
      const data = "data";
      const resolveExecutor = (resolve, reject) => {
        setTimeout(() => {
          resolve(data);
        }, 2000);
      };
      const resolver1 = jest.fn(val => val);
      const resolver2 = jest.fn(val => val);
      const resolver3 = jest.fn(val => val);
      const rejector1 = jest.fn();
      const rejector2 = jest.fn();
      const rejector3 = jest.fn();
      const promise = new MyPromise(resolveExecutor);

      promise
        .then(resolver1, rejector1)
        .then(resolver2, rejector2)
        .then(resolver3, rejector3);

      jest.advanceTimersByTime(2000);

      expect(rejector1).toHaveBeenCalledTimes(0);
      expect(rejector2).toHaveBeenCalledTimes(0);
      expect(rejector3).toHaveBeenCalledTimes(0);

      expect(resolver1).toHaveBeenCalledTimes(1);
      expect(resolver1).toHaveBeenCalledWith(data);
      expect(resolver2).toHaveBeenCalledTimes(1);
      expect(resolver2).toHaveBeenCalledWith(data);
      expect(resolver3).toHaveBeenCalledTimes(1);
      expect(resolver3).toHaveBeenCalledWith(data);
    });

    it("should chain then for rejected case", () => {
      const error = new Error("error");
      const rejectExecutor = (resolve, reject) => {
        setTimeout(() => {
          reject(error);
        }, 2000);
      };
      const resolver1 = jest.fn();
      const rejector1 = jest.fn(error => {
        return error;
      });
      const resolver2 = jest.fn(val => {
        throw val;
      });
      const rejector2 = jest.fn();
      const resolver3 = jest.fn();
      const rejector3 = jest.fn();
      const promise = new MyPromise(rejectExecutor);

      promise
        .then(resolver1, rejector1)
        .then(resolver2, rejector2)
        .then(resolver3, rejector3);

      jest.advanceTimersByTime(2000);

      expect(resolver1).toHaveBeenCalledTimes(0);
      expect(rejector1).toHaveBeenCalledTimes(1);
      expect(rejector1).toHaveBeenCalledWith(error);

      expect(rejector2).toHaveBeenCalledTimes(0);
      expect(resolver2).toHaveBeenCalledTimes(1);
      expect(resolver2).toHaveBeenCalledWith(error);
      expect(resolver3).toHaveBeenCalledTimes(0);
      expect(rejector3).toHaveBeenCalledTimes(1);
      expect(rejector3).toHaveBeenCalledWith(error);
    });

    it("should resolve what's resolved from the inner promise", () => {
      const innerPromiseExecutor = resolve => {
        setTimeout(() => {
          resolve("data from inner promise");
        }, 2000);
      };
      const promise0 = new MyPromise(innerPromiseExecutor);
      const outerPromiseExecutor = resolve => {
        setTimeout(() => {
          resolve(promise0);
        }, 2000);
      };
      const resolver1 = jest.fn();
      const rejector1 = jest.fn();
      const promise = new MyPromise(outerPromiseExecutor);

      promise.then(resolver1, rejector1);

      jest.advanceTimersByTime(4000);
      expect(rejector1).toHaveBeenCalledTimes(0);
      expect(resolver1).toHaveBeenCalledTimes(1);
      expect(resolver1).toHaveBeenCalledWith("data from inner promise");
    });

    it("should reject what's rejected from the inner promise", () => {
      const error = new Error("error from inner");
      const innerPromiseExecutor = (resolve, reject) => {
        setTimeout(() => {
          reject(error);
        }, 2000);
      };
      const promise0 = new MyPromise(innerPromiseExecutor);
      const outerPromiseExecutor = (resolve, reject) => {
        setTimeout(() => {
          reject(promise0);
        }, 2000);
      };
      const resolver1 = jest.fn();
      const rejector1 = jest.fn();
      const promise = new MyPromise(outerPromiseExecutor);

      promise.then(resolver1, rejector1);

      jest.advanceTimersByTime(4000);
      expect(resolver1).toHaveBeenCalledTimes(0);
      expect(rejector1).toHaveBeenCalledTimes(1);
      expect(rejector1).toHaveBeenCalledWith(error);
    });

    it("should resolve the rejected content from the inner promise", () => {
      const error = new Error("error from inner");
      const innerPromiseExecutor = (resolve, reject) => {
        setTimeout(() => {
          reject(error);
        }, 2000);
      };
      const promise0 = new MyPromise(innerPromiseExecutor);
      const outerPromiseExecutor = (resolve, reject) => {
        setTimeout(() => {
          resolve(promise0);
        }, 2000);
      };
      const resolver1 = jest.fn();
      const rejector1 = jest.fn();
      const promise = new MyPromise(outerPromiseExecutor);

      promise.then(resolver1, rejector1);

      jest.advanceTimersByTime(4000);
      expect(rejector1).toHaveBeenCalledTimes(0);
      expect(resolver1).toHaveBeenCalledTimes(1);
      expect(resolver1).toHaveBeenCalledWith(error);
    });

    it("should reject what's resolved from the inner promise", () => {
      const innerPromiseExecutor = (resolve, reject) => {
        setTimeout(() => {
          resolve("error");
        }, 2000);
      };
      const promise0 = new MyPromise(innerPromiseExecutor);
      const outerPromiseExecutor = (resolve, reject) => {
        setTimeout(() => {
          reject(promise0);
        }, 2000);
      };
      const resolver1 = jest.fn();
      const rejector1 = jest.fn();
      const promise = new MyPromise(outerPromiseExecutor);

      promise.then(resolver1, rejector1);

      jest.advanceTimersByTime(4000);
      expect(resolver1).toHaveBeenCalledTimes(0);
      expect(rejector1).toHaveBeenCalledTimes(1);
      expect(rejector1).toHaveBeenCalledWith("error");
    });

    describe("Not required from Promise/A+", () => {
      it("should return a promise from Promise.resolve, Promise.reject", () => {
        expect(MyPromise.resolve()).toBeInstanceOf(MyPromise);
        expect(MyPromise.reject()).toBeInstanceOf(MyPromise);
      });

      it("should return a new promise for catch from promise instance", () => {
        const resolver = jest.fn();

        const promise1 = new MyPromise(resolver);
        expect(promise1.catch()).toBeInstanceOf(MyPromise);
      });

      it("the callbacks of then/catch should receive the value/reason from Promise.resolve, Promise.reject", () => {
        const resolver = jest.fn();
        const rejector = jest.fn();
        const data = "data";
        const error = new Error("error");

        MyPromise.resolve(data).then(resolver);
        jest.advanceTimersByTime(100);

        expect(resolver).toHaveBeenCalledTimes(1);
        expect(resolver).toHaveBeenCalledWith(data);

        MyPromise.reject(error).catch(rejector);
        jest.advanceTimersByTime(100);

        expect(rejector).toHaveBeenCalledTimes(1);
        expect(rejector).toHaveBeenCalledWith(error);
      });

      it("should exec callbacks in then/catch of Promise.resolve and Promise.reject asynchronously", () => {
        const resolver = jest.fn();
        const rejector = jest.fn();
        const data = "data";
        const error = new Error("error");

        MyPromise.resolve(data).then(resolver);
        expect(resolver).toHaveBeenCalledTimes(0);

        MyPromise.reject(error).catch(rejector);
        expect(rejector).toHaveBeenCalledTimes(0);
      });

      it("the callback of catch should receive the error of the promise when invoked", () => {
        const data = "data";
        const error = new Error("error");
        const rejectExecutor = (resolve, reject) => reject(error);
        const rejector = jest.fn();
        const promise = new MyPromise(rejectExecutor);

        promise.catch(rejector);
        jest.advanceTimersByTime(100);
        expect(rejector).toHaveBeenCalledTimes(1);
        expect(rejector).toHaveBeenCalledWith(error);
      });

      it("should invoke catch when promise is rejected", () => {
        const error = new Error("error");
        const rejector = jest.fn();
        MyPromise.reject(error).catch(rejector);
        jest.advanceTimersByTime(100);

        expect(rejector).toHaveBeenCalledTimes(1);
        expect(rejector).toHaveBeenCalledWith(error);
      });

      it("should invoke catch when promise is rejected by error", () => {
        const error = new Error("error");
        const rejector = jest.fn();
        new MyPromise(() => {
          throw error;
        }).catch(rejector);
        jest.advanceTimersByTime(100);

        expect(rejector).toHaveBeenCalledTimes(1);
        expect(rejector).toHaveBeenCalledWith(error);
      });

      it("should invoke onRejected of then when promise is rejected", () => {
        const error = new Error("error");
        const onFufilled = jest.fn();
        const onRejected = jest.fn();
        MyPromise.reject(error).then(onFufilled, onRejected);
        jest.advanceTimersByTime(100);

        expect(onFufilled).toHaveBeenCalledTimes(0);
        expect(onRejected).toHaveBeenCalledTimes(1);
        expect(onRejected).toHaveBeenCalledWith(error);
      });
      const rejector2 = jest.fn();

      it("should not invoke chained then when promise is rejected", () => {
        const error = new Error("error");
        const resolver2 = jest.fn();
        const rejector2 = jest.fn();
        MyPromise.reject(error)
          .then(resolver2)
          .catch(rejector2);
        jest.advanceTimersByTime(100);

        expect(resolver2).toHaveBeenCalledTimes(0);
        expect(rejector2).toHaveBeenCalledTimes(1);
        expect(rejector2).toHaveBeenCalledWith(error);
      });

      it("should chain the catch and then", () => {
        const data = "data";
        const error = new Error("error");
        const resolver1 = jest.fn();
        const rejector1 = jest.fn(error => error);
        const resolver2 = jest.fn(() => {
          throw error;
        });
        const rejector2 = jest.fn();
        MyPromise.reject(error)
          .catch(rejector1)
          .then(resolver1);
        jest.advanceTimersByTime(100);
        MyPromise.resolve(data)
          .then(resolver2)
          .catch(rejector2);
        jest.advanceTimersByTime(100);

        expect(resolver1).toHaveBeenCalledTimes(1);
        expect(resolver1).toHaveBeenCalledWith(error);
        expect(resolver2).toHaveBeenCalledTimes(1);
        expect(resolver2).toHaveBeenCalledWith(data);
        expect(rejector1).toHaveBeenCalledTimes(1);
        expect(rejector1).toHaveBeenCalledWith(error);
        expect(rejector2).toHaveBeenCalledTimes(1);
        expect(rejector2).toHaveBeenCalledWith(error);
      });
    });
  });
});
