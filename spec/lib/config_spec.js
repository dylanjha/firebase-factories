/* eslint-env jasmine */

'use strict'

describe('config', () => {
  it('should cache the config arross re-loads', () => {
    const config1 = require('../../config')({firebase: 'some-firebase'})
    const config2 = require('../../config')()
    expect(config1.firebase).toEqual(config2.firebase)
  })
})
