/**
  See README.md
*/

const _ = require('lodash')

module.exports = (config) => {
  // keep track of fixtures that have been defined
  let DEF = {}
  // keep a count of each instance of each fixture
  let COUNT = global.COUNT = {}
  global.firebase = config.firebase

  const Factory = require('./lib/factory')()

  function define (name, options) {
    if (DEF[name]) { throw new Error(`Factory ${name} already defined`) }
    const factory = new Factory(name, options || {})
    // save a reference to this defined fixture and set up the counter
    DEF[name] = factory
    COUNT[name] = 0
    return factory
  }

  function reset () {
    return new Promise((resolve, reject) => {
      const defers = []
      _.each(DEF, (factory, name) => {
        COUNT[name] = 0
        defers.push(factory.rootRef.set(null))
      })
      Promise.all(defers).then(() => {
        resolve(true)
      }, reject)
    })
  }

  return {
    define: define,
    reset: reset
  }
}
