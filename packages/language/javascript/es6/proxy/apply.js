function decoratee(a, b) { return a+b; }

function decorator(fn) {
  return function(...args) {
    return fn(...args);
  };
}

let fn1 = decorator(decoratee);
// console.log('fn1.name', fn1.name); //=> undefined
// console.log('fn1(1,2)', fn1(1,2));



function proxyDecorator(fn) {
  return new Proxy(fn, {
    apply(target, thisArg, args) {
console.log('apply ---- ');
      return Reflect.apply(target, thisArg, args);
    },
    get(target, property) {
console.log('get ---- ', target, property);
    }
  });
}

let fn2 = proxyDecorator(decoratee);
console.log('fn2.name', fn2.name); //=> fn2.name decoratee
const { name } = fn2;
console.log('name: ', name)
console.log('fn2(1,2)', fn2(1,2));
