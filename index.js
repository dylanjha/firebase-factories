/**
  See README.md
*/

const _ = require('lodash')
// keep track of fixtures that have been defined
let DEF = {}
// keep a count of each instance of each fixture
const counter = require('./lib/counter')

module.exports = (config) => {
  require('./config')(config)
  const Factory = require('./lib/factory')

  function define (name, options) {
    if (DEF[name]) { throw new Error(`Factory ${name} already defined`) }
    const factory = new Factory(name, options || {})
    // save a reference to this defined fixture and set up the counter
    DEF[name] = factory
    counter.setup(name)
    return factory
  }

  function reset () {
    return new Promise((resolve, reject) => {
      const defers = []
      _.each(DEF, (factory, name) => {
        counter.reset(name)
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
