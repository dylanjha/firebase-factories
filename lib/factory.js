/*
  globals COUNT firebase
*/
/**
* class Factory
*   defines how to create a fixture and how to save the data
*/

const _ = require('lodash')

module.exports = (config) => {
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
      this.attributes = options.attributes // function
      this.afterSave = options.afterSave // function
    }

    /**
      Public method that creates an instance of the fixture and saves it
    */
    create (overrides, options) {
      if (!(COUNT[this.name] >= 0)) {
        throw new Error('Missing counter for this Factory')
      }
      const count = COUNT[this.name] += 1
      overrides = overrides || {}
      options = options || {}
      const base = this.attributes(count, options)
      const record = _.merge(base, overrides)
      const resource = _.clone(record)
      resource.$id = this.id(count, options)
      resource.$save = () => {
        return this.rootRef.child(resource.$id).set(record).then(() => {
          return this.afterSave(count, options, resource)
        })
      }
      return resource
    }
  }

  return Factory
}
