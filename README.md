# Firebase Factories

Define factories for your models and use the factory to save data to your firebase.

# Example

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

//
// These user objects created by the UserFactory.create function
// These users all have:
//  * `$id`: property which is the id at /users/<id>
//  * `$loaded`: function that returns a promise that will be resolved
//           when the record is saved and the afterSave() callback is complete
//  * all the properties that were returned by `attributes`
//
const userRegular = UserFactory.create()
const userAdmin = UserFactory.create({}, {isAdmin: true})
const userJane = UserFactory.create({info: {name: 'Jane'}})

Promise.all([
  userRegular.$loaded(), 
  userAdmin.$loaded(), 
  userJane.$loaded(), 
]).then((values) => {
  console.log('All the users have been saved')
  console.log(userRegular.$id, userRegular.info.name)
  console.log(userAdmin.$id, userAdmin.info.name)
  console.log(userJane.$id, userJane.info.name)
})
