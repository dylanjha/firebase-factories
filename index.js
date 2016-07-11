/**
 *
 * Create fixture data and load it into a firebase database
 *   initialize with config object:
 *      {
 *        firebase: <firebase-ref> (the root of your firebase)
 *      }
 *
 *   Exports one global object:
 *     {
 *        // define a new factory
 *        define: function () {}
 *        // clear out all saved factories from the database
 *        reset: function () { }
 *     }
 *
 *    Example usage:
 *      const factories = require('firebase-factories')
 *      const UserFactory = factores.create('User', {
 *        defaults: (n, options) => { return {info: name: `User ${n}`}},
 *        root: 'users',
 *        afterSave: (n, options, record) => { }
 *      })
 *
 *      const user1 = UserFactory.create({}, {isAdmin: true})
 *      user1.$loaded() is a promise that will be fulfilled when
 *                      the afterSave callback is complete
*/

const _ = require('lodash')

module.exports = (config) => {
  const firebase = config.firebase
  // keep track of fixtures that have been defined
  let DEF = {}
  // keep a count of each instance of each fixture
  let COUNT = {}

  /**
  * class Factory
  *   defines how to create a fixture and how to save the data
  */
  class Factory {
    /**
      @constructor
      @param name (required): String, the model name of this fixutre (example: 'User')
      @options:
         root (required): String, the root path in firebase, (example: 'users')
      @returns instance of FactoryDef
    */
    constructor (name, options) {
      this.name = name
      this.id = options.id // function
      this.root = options.root
      this.rootRef = firebase.child(this.root)
      this.defaults = options.defaults // function
      this.afterSave = options.afterSave // function
    }

    /**
      Public method that creates an instance of the fixture and saves it
    */
    create (overrides, options) {
      if (!COUNT[this.name]) {
        COUNT[this.name] = 0
      }
      const count = COUNT[this.name] += 1
      overrides = overrides || {}
      options = options || {}
      const id = this.id(count, options)
      const base = this.defaults(count, options)
      const record = _.merge(base, overrides)
      const fixture = _.clone(record)
      fixture.id = id
      fixture.$loaded = () => {
        return this.rootRef.child(id).set(record).then(() => {
          return this.afterSave(fixture)
        })
      }
      return fixture
    }
  }

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
        defers.push(factory.rootRef.set(null))
      })
      Promise.all(defers).then(() => {
        COUNT = {}
        resolve(true)
      }, reject)
    })
  }

  return {
    define: define,
    reset: reset
  }
}
