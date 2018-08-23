export function debounce(fn, wait, options = {}) {
  let { leading = false, maxWait } = options;
  let waitTimer;
  let startTime;

  return () => {
    const clear = () => {
      clearTimeout(waitTimer);
      waitTimer = null;
    };
    const start = () => {
      startTime = Date.now();
      waitTimer = setTimeout(() => {
        fn();
        clear();
        leading = options.leading;
      }, wait);
      return clear;
    };

    if (leading) {
      fn();
      leading = false;
      return clear;
    }

    if (waitTimer) {
      if (maxWait > 0 && Date.now() - startTime <= maxWait) {
        return clear;
      }
      clear();
      return start();
    }

    return start();
  };
}

export function throttle(fn, wait, options = {}) {
  return debounce(fn, wait, { ...options, maxWait: wait });
}
