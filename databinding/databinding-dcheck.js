'use strict'

observe(provider, 'message', message => {
    consumer.innerHTML = message
})

function observe(provider, prop, handler) {
    provider._handlers[prop] = handler
}

function digestProvider(provider) {
    for (let prop in provider._handlers) {
        if (provider._prevValues[prop] !== provider[prop]) {
            provider._prevValues[prop] = provider[prop]
            handler(provider[prop])
        }
    }
}

// may call digest when under certain change updates or by polling.
function digest() {
    providers.forEach(digestProvider)
}
