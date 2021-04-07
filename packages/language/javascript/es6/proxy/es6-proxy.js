// 1. trap set/get/has to prevent access to protected properties.
function inconstiant(key, action) {
  if (key[0] === '_') {
    throw new Error(`Invalid attempt to ${action} private "${key}" property`)
  }
}

const target = { _prop: 'foo', pony: 'foo' }
const handler = {
  get(target, key) {
    inconstiant(key, 'get')
    return target[key]
  },
  set(target, key, value) {
    inconstiant(key, 'set')
    return true
  },
  has(target, key) {
    if (key[0] === '_') {
      return false
    }
    return key in target
  },
  deleteProperty(target, key) {
    inconstiant(key, 'delete')
    return true
  },
  defineProperty(target, key, discriptor) {
    inconstiant(key, 'defineProperty')
    return true
  },
  enumerate(target) {
    return Object.keys(target).filter(key => key[0] !== '_')[Symbol.iterator]()
  },
  ownKeys(target) {
    return Reflect.ownKeys(target).filter(key => key[0] !== '_')
  }
}

const proxy = new Proxy(target, handler)





print(`
// 1. trap set/get/has to prevent access to protected properties.

const target = { _prop: 'foo', pony: 'foo' }
const handler = {
  get(target, key) {
    inconstiant(key, 'get')
    return target[key]
  },
  set(target, key, value) {
    inconstiant(key, 'set')
    return true
  },
  has(target, key) {
    if (key[0] === '_') {
      return false
    }
    return key in target
  },
  deleteProperty(target, key) {
    inconstiant(key, 'delete')
    return true
  },
  defineProperty(target, key, discriptor) {
    inconstiant(key, 'defineProperty')
    return true
  },
  enumerate(target) {
    return Object.keys(target).filter(key => key[0] !== '_')[Symbol.iterator]()
  },
  ownKeys(target) {
    return Reflect.ownKeys(target).filter(key => key[0] !== '_')
  }
}

const proxy = new Proxy(target, handler)

`);

printKeyValue("'pony' in proxy", 'pony' in proxy)
  // <- true
printKeyValue("'_prop' in target", '_prop' in target)
  // <- true
printKeyValue("'_prop' in proxy", '_prop' in proxy)
  // <- false

try {
  print("delete proxy._prop:")
  delete proxy._prop
    // <- Error: Invalid attempt to delete private "_prop" property
} catch (e) {
  console.error('expected delete error: ' + e);
}

try {
  print("proxy._prop2 = 'sb':")
  proxy._prop2 = 'sb'
} catch (e) {
  console.error('expected assign error: ' + e);
}

print(`
  for (let key in proxy) {
    printKeyValue(key)
      // <- no '_prop'
  }

`)
for (let key in proxy) {
  print(key)
    // <- no '_prop'
}

print(`
  for (let key of Object.keys(proxy)) {
    print(key)
      // <- no '_prop'
  }
`)
for (let key of Object.keys(proxy)) {
  print(key)
    // <- 'pony'
}

printKeyValue('Reflect.ownKeys(proxy)', Reflect.ownKeys(proxy));
// <- 'pony'




print(`
---------------------------------------------------------------------------------------
`)




// 2. handler.apply
function sum(left, right) {
  return left + right
}

const twice = {
  apply(target, ctx, args) {
    return Reflect.apply(...arguments) * 2
  }
}

const proxy2 = new Proxy(sum, twice)




print(`
// 2. handler.apply

function sum(left, right) {
  return left + right
}

const twice = {
  apply(target, ctx, args) {
    return Reflect.apply(...arguments) * 2
  }
}

const proxy2 = new Proxy(sum, twice)
`);

printKeyValue('proxy2(1, 2)', proxy2(1, 2))
  // <- 6
printKeyValue('proxy2(...[3, 4])', proxy2(...[3, 4]))
  // <- 14
printKeyValue('proxy2.call(null, 5, 6)', proxy2.call(null, 5, 6))
  // <- 22
printKeyValue('proxy2.apply(null, [7, 8])', proxy2.apply(null, [7, 8]))
  // <- 30
