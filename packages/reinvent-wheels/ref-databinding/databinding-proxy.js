'use strict'

// export API functions
const dataBinding = {
  observe,
  unobserve,
  observable,
  isObservable
}

/*
 * nextTick
 */
let mutateWithTask
let currTask

if (typeof MutationObserver !== 'undefined') {
  let counter = 0
  const onMutation = () => {
    if (currTask) {
      currTask()
    }
  }
  const observer = new MutationObserver(onMutation)
  const textNode = document.createTextNode(String(counter))

  observer.observe(textNode, { characterData: true })

  mutateWithTask = function mutateWithTask() {
    counter = (counter + 1) % 2
    textNode.data = String(counter)
  }
}

const nextTick = (task) => {
  currTask = task
  if (mutateWithTask) {
    mutateWithTask()
  } else {
    Promise.resolve().then(task)
  }
}

/*
 * observable
 */
const proxy = Symbol('proxy')
const unobserverSet = Symbol('unobserverSet')
const observing = Symbol('observing')

const targets = new WeakMap()
const observerSet = new Set()
let currentObserver


function observe(fn) {
  if (typeof fn !== 'function') {
    throw new TypeError('first argument must be a function')
  }

  if (!fn[observing]) {
    fn[observing] = true
    fn[unobserverSet] = new Set()
    _runObserver(fn)
  }
}

function unobserve(fn) {
  if (typeof fn !== 'function') {
    throw new TypeError('first argument must be a function')
  }

  if (fn[observing]) {
    fn[unobserverSet].forEach(_runUnobserver)
    fn[unobserverSet] = undefined
  }

  fn[observing] = false
}

function observable(obj) {
  if (obj === undefined) {
    obj = {}
  }

  if (typeof obj !== 'object') {
    throw new TypeError('first argument must be an object or undefined')
  }

  if (isObservable(obj)) {
    return obj
  }

  if (typeof obj[proxy] === 'object') {
    return obj[proxy]
  }

  obj[proxy] = new Proxy(obj, { get: __get, set: __set, deleteProperty: __deleteProperty })
  targets.set(obj, new Map())

  return obj[proxy]
}

function isObservable(obj) {
  if (typeof obj !== 'object') {
    throw new TypeError('first argument must be an object')
  }

  return (obj[proxy] === true)
}


// private/protected functions
function __get(target, key, receiver) {
  if (key === proxy) {
    return true
  } else if (key === '$raw') {
    return target
  }

  const result = Reflect.get(target, key, receiver)

  if (currentObserver) {
    _registerObserver(target, key, currentObserver)
    if (typeof result === 'object' && !(result instanceof Date)) {
      return observable(result)
    }
  }
  if (typeof result === 'object' && typeof result[proxy] === 'object') {
    return result[proxy]
  }

  return result
}

function __set(target, key, value, receiver) {
  if (targets.get(target).has(key)) {
    targets.get(target).get(key).forEach(_queueObserver)
  }

  return Reflect.set(target, key, value, receiver)
}

function __deleteProperty(target, key) {
  if (targets.get(target).has(key)) {
    targets.get(target).get(key).forEach(_queueObserver)
  }

  return Reflect.deleteProperty(target, key)
}

function _registerObserver(target, key, observer) {
  let observersForKey = targets.get(target).get(key)

  if (!observersForKey) {
    observersForKey = new Set()
    targets.get(target).set(key, observersForKey)
  }

  if (!observersForKey.has(observer)) {
    observersForKey.add(observer)
    observer[unobserverSet].add(() => observersForKey.delete(observer))
  }
}

function _queueObserver(observer) {
  if (observerSet.size === 0) {
    nextTick(_runObservers)
  }

  observerSet.add(observer)
}

function _runObservers() {
  try {
    observerSet.forEach(_runObserver)
  } finally {
    observerSet.clear()
  }
}

function _runObserver(observer) {
  if (observer[observing]) {
    currentObserver = observer
    try {
      observer()
    } finally {
      currentObserver = undefined
    }
  }
}

function _runUnobserver(unobserver) {
  unobserver()
}