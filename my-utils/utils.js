export function debounce(fn, wait, { leading = false, maxWait } = {}) {
  let lead = leading;
  let waitTimer;
  let startTime;
  const clear = () => {
    clearTimeout(waitTimer);
    waitTimer = null;
  };
  const start = (...args) => {
    startTime = Date.now();
    waitTimer = setTimeout(() => {
      fn(...args);
      clear();
      lead = leading;
    }, wait);
  };

  const debounced = (...args) => {
    if (lead) {
      fn(...args);
      lead = false;
      return;
    }

    if (waitTimer) {
      if (maxWait > 0 && Date.now() - startTime <= maxWait) {
        return;
      }
      clear();
    }
    start(...args);
  };
  debounced.cancel = clear;

  return debounced;
}

export function throttle(fn, wait, options = {}) {
  return debounce(fn, wait, { ...options, maxWait: wait });
}
