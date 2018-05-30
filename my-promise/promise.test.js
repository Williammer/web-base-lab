import MyPromise from "./promise";

describe('Promise tests', () => {
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

    it("should have static property of resolve and reject from Promise constructor", () => {
      expect(MyPromise.resolve).toBeInstanceOf(Function);
      expect(MyPromise.reject).toBeInstanceOf(Function);
    });

    it("should have property of then and catch from promise instance", () => {
      const resolver = jest.fn();

      const promise = new MyPromise(resolver);
      expect(promise.then).toBeInstanceOf(Function);
      expect(promise.catch).toBeInstanceOf(Function);
    });
  });

  describe('Promise behaviors', () => {
    it("should return promise for Promise.resolve, Promise.reject, then and catch from promise instance", () => {
      const resolver = jest.fn();

      const promise1 = new MyPromise(resolver);
      const promise2 = new MyPromise(resolver);
      expect(promise1.then()).toBeInstanceOf(MyPromise);
      expect(promise2.catch()).toBeInstanceOf(MyPromise);
      expect(MyPromise.resolve()).toBeInstanceOf(MyPromise);
      expect(MyPromise.reject()).toBeInstanceOf(MyPromise);
    });

    it("should exec then/catch of a promise asynchronously", () => {
      const executor = jest.fn();
      const resolver = jest.fn();
      const rejector = jest.fn();
      const promise1 = new MyPromise(executor);
      const promise2 = new MyPromise(executor);

      promise1.then(resolver);
      expect(resolver).toHaveBeenCalledTimes(0);

      promise2.catch(rejector);
      expect(rejector).toHaveBeenCalledTimes(0);
    });

    it("should exec then/catch of Promise.resolve and Promise.reject asynchronously", () => {
      const resolver = jest.fn();
      const rejector = jest.fn();
      const data = "data";
      const error = new Error('error');

      MyPromise.resolve(data)
        .then(resolver);
      expect(resolver).toHaveBeenCalledTimes(0);

      MyPromise.reject(error)
        .catch(rejector);
      expect(rejector).toHaveBeenCalledTimes(0);
    });

    it("should receive the result/error of Promise.resolve, Promise.reject from the callback param of then and catch", async () => {
      const resolver = jest.fn();
      const rejector = jest.fn();
      const data = "data";
      const error = new Error('error');

      await MyPromise.resolve(data).then(resolver);
      expect(resolver).toHaveBeenCalledTimes(1);
      expect(resolver).toHaveBeenCalledWith(data);

      await MyPromise.reject(error).catch(rejector);
      expect(rejector).toHaveBeenCalledTimes(1);
      expect(rejector).toHaveBeenCalledWith(error);
    });

    it("should resolve/reject the result/error of a promise to the callback param of then and catch", async () => {
      const data = "data";
      const error = new Error('error');
      const resolveExecutor = (resolve, reject) => resolve(data);
      const rejectExecutor = (resolve, reject) => reject(error);
      const resolver = jest.fn();
      const rejector = jest.fn();
      const promise1 = new MyPromise(resolveExecutor);
      const promise2 = new MyPromise(rejectExecutor);

      await promise1.then(resolver);
      expect(resolver).toHaveBeenCalledTimes(1);
      expect(resolver).toHaveBeenCalledWith(data);

      await promise2.catch(rejector);
      expect(rejector).toHaveBeenCalledTimes(1);
      expect(rejector).toHaveBeenCalledWith(error);
    });

    it("should invoke catch when promise is rejected", async () => {
      const error = new Error("error");
      const rejector = jest.fn();
      await MyPromise.reject(error).catch(rejector);

      expect(rejector).toHaveBeenCalledTimes(1);
      expect(rejector).toHaveBeenCalledWith(error);
    });

    it("should invoke catch when promise is rejected by error", async () => {
      const error = new Error("error");
      const rejector = jest.fn();
      await new MyPromise(() => {
        throw error;
      }).catch(rejector);

      expect(rejector).toHaveBeenCalledTimes(1);
      expect(rejector).toHaveBeenCalledWith(error);
    });

    it("should not invoke then when promise is rejected", async () => {
      const error = new Error("error");
      const resolver2 = jest.fn();
      const rejector2 = jest.fn();
      await MyPromise.reject(error).then(resolver2).catch(rejector2);

      expect(resolver2).toHaveBeenCalledTimes(0);
      expect(rejector2).toHaveBeenCalledTimes(1);
      expect(rejector2).toHaveBeenCalledWith(error);
    });

    it("should chain the catch and then", async () => {
      const data = 'data';
      const error = new Error("error");
      const resolver1 = jest.fn();
      const rejector1 = jest.fn((error) => error);
      const resolver2 = jest.fn(() => { throw error; });
      const rejector2 = jest.fn();
      await MyPromise.reject(error).catch(rejector1).then(resolver1);
      await MyPromise.resolve(data).then(resolver2).catch(rejector2);

      expect(resolver1).toHaveBeenCalledTimes(1);
      expect(resolver1).toHaveBeenCalledWith(error);
      expect(resolver2).toHaveBeenCalledTimes(1);
      expect(resolver2).toHaveBeenCalledWith(data);
      expect(rejector1).toHaveBeenCalledTimes(1);
      expect(rejector1).toHaveBeenCalledWith(error);
      expect(rejector2).toHaveBeenCalledTimes(1);
      expect(rejector2).toHaveBeenCalledWith(error);
    });

    it("should not invoke then when promise is rejected by error", async () => {
      const error = new Error("error");
      const resolver2 = jest.fn();
      const rejector2 = jest.fn();
      await new MyPromise(() => {
        throw error;
      }).then(resolver2).catch(rejector2);

      expect(resolver2).toHaveBeenCalledTimes(0);
      expect(rejector2).toHaveBeenCalledTimes(1);
      expect(rejector2).toHaveBeenCalledWith(error);
    });

    it("should invoke onRejected of then when promise is rejected", async () => {
      const error = new Error("error");
      const onFufilled = jest.fn();
      const onRejected = jest.fn();
      await MyPromise.reject(error).then(onFufilled, onRejected);

      expect(onFufilled).toHaveBeenCalledTimes(0);
      expect(onRejected).toHaveBeenCalledTimes(1);
      expect(onRejected).toHaveBeenCalledWith(error);
    });

    it("should invoke onRejected of then when promise is rejected by error", async () => {
      const error = new Error("error");
      const onFufilled = jest.fn();
      const onRejected = jest.fn();
      await new MyPromise(() => {
        throw error;
      }).then(onFufilled, onRejected);

      expect(onFufilled).toHaveBeenCalledTimes(0);
      expect(onRejected).toHaveBeenCalledTimes(1);
      expect(onRejected).toHaveBeenCalledWith(error);
    });
  });
});