// 1. Inifinte get values.
print(`
1. Inifinte get values.

  function* fibs() {
    let a = 0;
    let b = 1;
    while (true) {
      yield a;
      [a, b] = [b, a + b];
    }
  }

  let [a, b, c, d, e, f] = fibs();
`);

function* fibs() {
  let a = 0;
  let b = 1;
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}

let [a, b, c, d, e, f] = fibs();

printKeyValue('a', a);
printKeyValue('b', b);
printKeyValue('c', c);
printKeyValue('d', d);
printKeyValue('e', e);
printKeyValue('f', f);


// 2. Generator used for Iterator
print(`
2. Generator used for Iterator

  const infinity = {
    [Symbol.iterator]: function*() {
      var c = 1;
      for (;;) {
        yield c++;
      }
    }
  }
  for (const n of infinity) {
    // truncate the sequence at 1000
    if (n > 10)
      break;
  }
`);

const infinity = {
  [Symbol.iterator]: function*() {
    var c = 1;
    for (;;) {
      yield c++;
    }
  }
}

for (const n of infinity) {
  // truncate the sequence at 1000
  if (n > 10)
    break;
  print(n);
}


// 3. spread the iterable
function* generator0() {
  yield 'p'
  console.log('o')
  yield 'n'
  console.log('y')
  yield 'f'
  console.log('o')
  yield 'o'
  console.log('!')
}

var foo0 = generator0()
console.log([...foo0])
console.log(Array.from(foo0))
  // <- 'o'
  // <- 'y'
  // <- 'o'
  // <- '!'
  // <- ['p', 'n', 'f', 'o']


function* generator() {
  yield * 'ponyfoo'
}
console.log([...generator()])
  // or just
console.log([...
  'ponyfoo'
])


// 4. iterator for array
var foo = {
  [Symbol.iterator]: () => ({
    items: ['p', 'o', 'n', 'y', 'f', 'o', 'o'],
    next: function next() {
      return {
        done: this.items.length === 0,
        value: this.items.shift()
      }
    }
  })
}

function* multiplier(value) {
  yield value * 2
  yield value * 3
  yield value * 4
  yield value * 5
}

// yield* handles sub-generator/iterables like spread
function* trailmix() {
  yield 0
  yield * [1, 2]
  yield * [...multiplier(2)]
  yield * multiplier(3)
  yield * foo
}
console.log([...trailmix()])
  // <- [0, 1, 2, 4, 6, 8, 10, 6, 9, 12, 15, 'p', 'o', 'n', 'y', 'f', 'o', 'o']


// 5. handle async - promise
const getTitleFromUrl = function*() {
  const url = 'https://jsonplaceholder.typicode.com/posts/1';
  let title = '',
    response = '',
    json = {};

  try {
    response = yield fetch(url);
    json = yield response.json();
  } catch (e) {
    console.error('[getTitleFromUrl] ' + e);
    return;
  }

  title = json.title;
  console.log('++++' + title);
  return title;
}


function coPromise(gen) {
  var iterator = gen(),
    count = 0;

  function _nextStep(it) {
    try {
      console.log('it.value: ' + it.value);
      console.log('it.done: ' + it.done);

      if (it.done) return it.value;

      let value = it.value;

      if (value instanceof Promise) {
        if (count === 1) {
          // throw new Error('<<>< pause!');
        }
        count++;
        return value.then(response => _nextStep(iterator.next(response)));
      } else {
        return _nextStep(iterator.next(it.value));
      }

    } catch (e) {
      console.error('[_nextStep] ' + e);
      iterator.throw(e); // generator error passing
    }
  }

  return _nextStep(iterator.next());
}

coPromise(getTitleFromUrl)
  .catch(e => console.error('------' + e))
  .then(end => console.log('------' + end));


// 6. handle async - callback
const foo = (name, callback) => {
  setTimeout(() => {
    callback(name);
  }, 1000);
};

const curry = (method, ...args) => {
  return (arg) => {
    args.push(arg);

    return method.apply({}, args);
  };
};

const coCallback = (generator) => {
  const iterator = generator();

  const _next = (name) => {
    var fooPartial;

    fooPartial = iterator.next(name);

    if (!fooPartial.done) {
      fooPartial.value(_next);
    }
  }

  _next();
};

coCallback(function*() {
  const a = yield curry(foo, 'a');
  const b = yield curry(foo, 'b');
  const c = yield curry(foo, 'c');

  console.log('---------- ', a, b, c);
});
