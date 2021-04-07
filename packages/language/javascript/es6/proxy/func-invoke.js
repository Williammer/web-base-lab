const obj = { a: 'a'};

const proxyObj = new Proxy(obj, {
  get(target, prop) {
    // console.log("intercept proxy: ", target, prop);

    return (...args) => {
      // console.log('Proxied function invoked!', args);
      return;
    }
  }
});

proxyObj['loveU']('forever');

// const { love } = proxyObj  // spread is the same as `const b = a.b`


const fn = function yesIdo() {}
const proxyFn = new Proxy(fn, {
  apply(target, thisArgs, args) {
    console.log("--------- target, thisArgs, args: ", target, thisArgs, args);
  }
});

proxyFn.call(obj, 'and do');