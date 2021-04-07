function deepEqual(a, b) {
  const typeOf = x =>
    ({}).toString
    .call(x)
    .match(/\[object (\w+)\]/)[1]

  const everyKey = f => Object.keys(a).every(f)

  switch (typeOf(a)) {
    case 'Array':
      return a.length === b.length &&
        everyKey(k => deepEqual(a.sort()[k], b.sort()[k]));
    case 'Object':
      return Object.keys(a).length === Object.keys(b).length &&
        everyKey(k => deepEqual(a[k], b[k]));
    default:
      return a === b;
  }
}

print(deepEqual({foo:'bar'}, {foo:'bar'}));
print(!deepEqual({foo:'bar'}, {foo:'baz'}));
print(deepEqual({}, {}));
print(deepEqual({a:{}}, {a:{}}));
print(!deepEqual({a:{b:[]}}, {a:{b:{}}}));
print(deepEqual({a:{b:[2]}}, {a:{b:[2]}}));
print(deepEqual({a:{b:[1, '{}']}}, {a:{b:[1, '{}']}}));
print(deepEqual({a:{b:[1, '{}']}}, {a:{b:['{}', 1]}}));
print(deepEqual({a:{b:[1, '{}', [3, '4', ['98']]]}}, {a:{b:[[['98'], 3, '4'], '{}', 1]}}));

print(!deepEqual({a:{b:[1, null]}}, {a:{b:['{}', 1]}}));
print(deepEqual({a:{b:[1, { bar: [1, 3, 2] }, '{}', null]}}, {a:{b:['{}', 1, {bar: [1, 2, 3]}, null]}}));
// -> all true