'use strict'

let _activeHandler

const dataBinding = {
  observe(handler) {
    // [@multiProp] handle muti prop handler observe
    _activeHandler = handler
    handler()
    _activeHandler = undefined
  },

  _observableProp(provider, prop) {
    let value = provider[prop]

    Object.defineProperty(provider, prop, {
      get() {
        // [init] assign handlers to each prop while the handler is calling in observe
        if (_activeHandler) {
          if (!provider._handlers) {
            provider._handlers = {}
          }

          provider._handlers[prop] = _activeHandler
        }

        return value
      },
      set(newValue) {
        value = newValue

        // [cb] call handler after value changed
        const handler = provider._handlers[prop]
        if (handler) {
          _activeHandler = handler
          handler()
          _activeHandler = undefined
        }
      }
    })
  },

  observable(provider) {
    for (let prop in provider) {
      this._observableProp(provider, prop)

      // [@subProp] handle nested props
      if (typeof provider[prop] === 'object') {
        this.observable(provider[prop])
      }
    }

    return provider
  }
}