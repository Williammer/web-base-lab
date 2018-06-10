/*
 * TODO: can unify API with the other 2 solutions?
 */

'use strict'

const dataBinding = {
  observe(provider, prop, handler) {
    provider._handlers[prop] = handler
  },

  digestProvider(provider) {
    for (let prop in provider._handlers) {
      if (provider._prevValues[prop] !== provider[prop]) {
        provider._prevValues[prop] = provider[prop]
        handler(provider[prop])
      }
    }
  },

  // may call digest when under certain change updates or by polling.
  digest() {
    providers.forEach(digestProvider)
  }
}