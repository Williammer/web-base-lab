const proxyCache = new WeakMap()

function compileCode(sourceCode) {
  // 1. use `new Function` to avoid accessing closure scope.
  // 2.1 use `with` to protect from accessing the global scope.
  const code = new Function("sandbox", `with(sandbox){ ${sourceCode} }`)

  return function(sandbox) {
    // 4. use WeakMap as cache for proxy
    if (!proxyCache.has(sandbox)) {
      const sandboxProxy = new Proxy(sandbox, { has, get })
      proxyCache.set(sandbox, sandboxProxy)
    }

    return code(proxyCache.get(sandbox))
  }
}

// 2.2 this trap intercepts 'in' operations on sandboxProxy to fool the 'with'
// to think all properties are in this 'sandboxProxy', so no need to access global.
function has(target, key) {
  return true
}

function get(target, key, receiver) {
  // 3. Here is to make all property keys as `not unscopables`, so as to
  // avoid accessing the global.
  if (key === Symbol.unscopables) return undefined
  return Reflect.get(target, key, receiver)
}

  // module.exports = { compileCode };