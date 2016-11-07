const proxyCache = new WeakMap()

function compileCode(src) {
    // 1. create a reusable sandbox function env.
    // 2. use with to protect the global access(can't hv 'use strict')
    const code = new Function("sandbox", `with(sandbox){ ${src} }`)

    return function(sandbox) {
        // 5. use WeakMap as cache for proxy
        if (!proxyCache.has(sandbox)) {
            const sandboxProxy = new Proxy(sandbox, { has, get })
            proxyCache.set(sandbox, sandboxProxy)
        }

        return code(proxyCache.get(sandbox))
    }
}

// 3. this trap intercepts 'in' operations on sandboxProxy to prevent the 'in' operator in 'with'
function has(target, key) {
    return true
}

function get(target, key) {
    // 4. The Symbol.unscopables is used to specify an object value of whose own and inherited property names are excluded from the 'with' environment bindings of the associated object.
    if (key === Symbol.unscopables) return undefined
    return target[key]
}
