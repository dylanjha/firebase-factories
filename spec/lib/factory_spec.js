/* eslint-env jasmine */

'use strict'

describe('Factory', () => {
  const config = require('../../config')()
  const firebase = config.firebase
  const factories = require('../../index')(config)

  beforeAll(() => {
    this.UserFactory = factories.define('User', {
      root: 'users',
      id: (n, options) => { return `test-user-${n}` },
      attributes: (n, options) => {
        const defaults = {info: {name: `User ${n}`, uid: `test-uid-${n}`}}
        if (options.isAdmin) {
          defaults.info.admin = true
        }
        return defaults
      },
      afterSave: (n, options, user) => {
        return firebase.child(`uids/${user.info.uid}`).set(user.$id)
      }
    })
  })

  describe('initializing', () => {
    it('should create with the defaults', () => {
      const user = this.UserFactory.create()
      expect(user.$id).toMatch(/test-user-\d/)
      expect(user.info.uid).toMatch(/test-uid-\d/)
      expect(user.info.admin).toBeUndefined()
    })

    it('should have overrideable defaults', () => {
      const user = this.UserFactory.create({info: {uid: 'my-own-uid'}})
      expect(user.$id).toMatch(/test-user-\d/)
      expect(user.info.uid).toMatch(/my-own-uid/)
      expect(user.info.admin).toBeUndefined()
    })

    it('should work with custom options', () => {
      const user = this.UserFactory.create({}, {isAdmin: true})
      expect(user.$id).toMatch(/test-user-\d/)
      expect(user.info.uid).toMatch(/test-uid-\d/)
      expect(user.info.admin).toEqual(true)
    })
  })

  describe('$save', () => {
    it('should persit the record to firebase', (done) => {
      const user = this.UserFactory.create()
      user.$save().then(() => {
        Promise.all([
          firebase.child(`users/${user.$id}`).once('value'),
          firebase.child(`uids/${user.info.uid}`).once('value')
        ]).then((values) => {
          const userData = values[0].val()
          const uidData = values[1].val()
          expect(userData.info.uid).toEqual(user.info.uid)
          expect(userData.info.name).toEqual(user.info.name)
          expect(uidData).toEqual(user.$id)
          done()
        })
      })
    })
  })
})
