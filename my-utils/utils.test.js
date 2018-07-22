import sinon from "sinon";
import * as utils from "./utils";

describe("utils", () => {
  let clock;
  beforeEach(() => {
    clock = sinon.useFakeTimers();
  });
  afterEach(() => {
    clock.restore();
  });

  describe("debounce(fn, wait, options)", () => {
    const { debounce } = utils;
    it("should only invoke the `fn` once after the `wait` time without more invoke", () => {
      const fn = jest.fn();
      const debouncedFn = debounce(fn, 1000);
      const runManyDebounced = () => {
        debouncedFn();
        debouncedFn();
        debouncedFn();
        debouncedFn();
        debouncedFn();
      };

      runManyDebounced();
      expect(fn).toHaveBeenCalledTimes(0);

      clock.tick(300);
      runManyDebounced();
      expect(fn).toHaveBeenCalledTimes(0);
      clock.tick(700);
      runManyDebounced();
      expect(fn).toHaveBeenCalledTimes(0);

      clock.tick(1000);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it("should be able to clear the debounce", () => {
      const fn = jest.fn();
      const debouncedFn = debounce(fn, 1000);

      debouncedFn();
      const clear = debouncedFn();
      debouncedFn();

      clock.tick(300);
      debouncedFn();

      clear();

      clock.tick(1000);
      expect(fn).toHaveBeenCalledTimes(0);
    });

    it("different debounced fn should be independent", () => {
      const fn1 = jest.fn();
      const fn2 = jest.fn();
      const debouncedFn1 = debounce(fn1, 600);
      const debouncedFn2 = debounce(fn2, 1000);

      const runManyDebounced = debouncedFn => {
        debouncedFn();
        debouncedFn();
        debouncedFn();
        debouncedFn();
        debouncedFn();
      };

      runManyDebounced(debouncedFn1);
      runManyDebounced(debouncedFn2);
      expect(fn1).toHaveBeenCalledTimes(0);
      expect(fn2).toHaveBeenCalledTimes(0);

      clock.tick(300);
      runManyDebounced(debouncedFn1);
      runManyDebounced(debouncedFn2);
      expect(fn1).toHaveBeenCalledTimes(0);
      expect(fn2).toHaveBeenCalledTimes(0);

      clock.tick(300);
      expect(fn1).toHaveBeenCalledTimes(0);
      expect(fn2).toHaveBeenCalledTimes(0);

      clock.tick(300);
      expect(fn1).toHaveBeenCalledTimes(1);
      expect(fn2).toHaveBeenCalledTimes(0);

      clock.tick(400);
      runManyDebounced(debouncedFn1);
      runManyDebounced(debouncedFn2);
      expect(fn1).toHaveBeenCalledTimes(1);
      expect(fn2).toHaveBeenCalledTimes(1);
    });

    describe("options", () => {
      it("should invoke immediately if `leading` option is true", () => {
        const fn = jest.fn();
        const debouncedLeadingFn = debounce(fn, 1000, { leading: true });

        debouncedLeadingFn();
        expect(fn).toHaveBeenCalledTimes(1);

        clock.tick(1000);
        expect(fn).toHaveBeenCalledTimes(1);
      });

      it("should invoke twice after wait time for if more than one invocations if `leading` option is true", () => {
        const fn = jest.fn();
        const debouncedLeadingFn = debounce(fn, 1000, { leading: true });

        debouncedLeadingFn();
        debouncedLeadingFn();
        debouncedLeadingFn();
        expect(fn).toHaveBeenCalledTimes(1);

        clock.tick(400);
        debouncedLeadingFn();
        debouncedLeadingFn();
        debouncedLeadingFn();

        expect(fn).toHaveBeenCalledTimes(1);

        clock.tick(600);
        expect(fn).toHaveBeenCalledTimes(1);

        clock.tick(400);
        expect(fn).toHaveBeenCalledTimes(2);
      });

      it("should not restart the debounce within the `maxWait` specified", () => {
        const fn = jest.fn();
        const debouncedMaxWaitFn = debounce(fn, 1000, { maxWait: 400 });

        debouncedMaxWaitFn();
        expect(fn).toHaveBeenCalledTimes(0);

        clock.tick(400);
        expect(fn).toHaveBeenCalledTimes(0);
        debouncedMaxWaitFn();

        clock.tick(600);
        expect(fn).toHaveBeenCalledTimes(1);

        fn.mockReset();

        // another round
        debouncedMaxWaitFn();
        expect(fn).toHaveBeenCalledTimes(0);
        clock.tick(500);

        debouncedMaxWaitFn();
        clock.tick(500);
        expect(fn).toHaveBeenCalledTimes(0);

        clock.tick(500);
        expect(fn).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("throttle(fn, wait, options)", () => {
    const { throttle } = utils;
    it("should only invoke the `fn` once after the `wait` time", () => {
      const fn = jest.fn();
      const throttledFn = throttle(fn, 1000);
      const runManyThrottled = () => {
        throttledFn();
        throttledFn();
        throttledFn();
        throttledFn();
        throttledFn();
      };

      runManyThrottled();
      expect(fn).toHaveBeenCalledTimes(0);

      clock.tick(300);
      runManyThrottled();
      expect(fn).toHaveBeenCalledTimes(0);
      clock.tick(700);
      runManyThrottled();
      expect(fn).toHaveBeenCalledTimes(1);

      clock.tick(990);
      runManyThrottled();
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it("should be able to clear the throttle", () => {
      const fn = jest.fn();
      const throttledFn = throttle(fn, 1000);

      throttledFn();
      const clear = throttledFn();
      throttledFn();

      clock.tick(300);
      throttledFn();

      clear();

      clock.tick(1000);
      expect(fn).toHaveBeenCalledTimes(0);
    });

    it("different throttled fn should be independent", () => {
      const fn1 = jest.fn();
      const fn2 = jest.fn();
      const throttledFn1 = throttle(fn1, 600);
      const throttledFn2 = throttle(fn2, 1000);

      const runManyThrottled = throttledFn => {
        throttledFn();
        throttledFn();
        throttledFn();
        throttledFn();
        throttledFn();
      };

      runManyThrottled(throttledFn1);
      runManyThrottled(throttledFn2);
      expect(fn1).toHaveBeenCalledTimes(0);
      expect(fn2).toHaveBeenCalledTimes(0);

      clock.tick(300);
      runManyThrottled(throttledFn1);
      runManyThrottled(throttledFn2);
      expect(fn1).toHaveBeenCalledTimes(0);
      expect(fn2).toHaveBeenCalledTimes(0);

      clock.tick(300);
      runManyThrottled(throttledFn1);
      runManyThrottled(throttledFn2);
      expect(fn1).toHaveBeenCalledTimes(1);
      expect(fn2).toHaveBeenCalledTimes(0);

      clock.tick(400);
      runManyThrottled(throttledFn1);
      runManyThrottled(throttledFn2);
      expect(fn1).toHaveBeenCalledTimes(1);
      expect(fn2).toHaveBeenCalledTimes(1);
    });

    describe("options", () => {
      it("should invoke immediately if `leading` option is true", () => {
        const fn = jest.fn();
        const throttledLeadingFn = throttle(fn, 1000, { leading: true });

        throttledLeadingFn();
        expect(fn).toHaveBeenCalledTimes(1);

        clock.tick(1000);
        expect(fn).toHaveBeenCalledTimes(1);
      });

      it("should invoke twice after wait time for if more than one invocations if `leading` option is true", () => {
        const fn = jest.fn();
        const throttledLeadingFn = throttle(fn, 1000, { leading: true });

        throttledLeadingFn();
        throttledLeadingFn();
        throttledLeadingFn();
        expect(fn).toHaveBeenCalledTimes(1);

        clock.tick(1000);
        expect(fn).toHaveBeenCalledTimes(2);

        throttledLeadingFn();
        throttledLeadingFn();
        throttledLeadingFn();
        expect(fn).toHaveBeenCalledTimes(3);

        clock.tick(1000);
        expect(fn).toHaveBeenCalledTimes(4);
      });
    });
  });
});
