# Firebase Factories

Define factories for your models and use the factory to save data to your firebase.

# Example

1. Define a factory with `factories.define`
2. Use this factory definition to create and save new data to firebase

## factories.define

```javascript
const factories = require('firebase-factories')({firebase: new Firebase(<my-firebase-root>)})

const UserFactory = factories.define('User', {
  // define the root of where this collection lives
  root: 'users',
  // provide a function that tells the factory how to calculate ids for the
  // newly generated users n is a number that gets incremented with every factory
  // of this type that gets created
  id: (n, options) => {
    return `test-user-${id}`
  },
  // provide a function that returns an object which will be used as the user record
  attributes: (n, options) => {
    const defaults = {info: {name: `User ${n}`, uid: `test-uid-${n}`}}
    if (options.isAdmin) {
      defaults.info.admin = true
    }
    return defaults
  },
  // return a promise that gets called after the user is saved
  // this is useful for setting up other records that need to 
  // exist in order to look up the user id
  afterSave: (n, options, user) => {
    return firebase.child(`uids/${user.info.uid}`).set(user.$id)
  }
})
```

## Create and save data
* Use the `Factory.create(overrides = {}, options = {})` method on your factory definition
  - `overrides` is an object that will override the default `attributes` from your factory definition
  - `options` is an object that will get passed into the `attributes` function. See example usage for creating regular users vs. creating admin users.
* These new objects will get saved to firebase with whatever you return from the `attributes` function in the factory definition.
* There will be two other properties attached to these saved records:
  - `$id`: the id of the object
  - `$save`: a function that returns a promise that resolves after the record is saved and the afterSave() callback is completed


```javascript
const userRegular = UserFactory.create()
const userAdmin = UserFactory.create({}, {isAdmin: true})
const userJane = UserFactory.create({info: {name: 'Jane'}})

Promise.all([
  userRegular.$save(), 
  userAdmin.$save(), 
  userJane.$save(), 
]).then((values) => {
  console.log('All the users have been saved')
  console.log(userRegular.$id, userRegular.info.name)
  console.log(userAdmin.$id, userAdmin.info.name)
  console.log(userJane.$id, userJane.info.name)
})
```

## TODO

* tests (use firebase-server to create tests)
* js standard
