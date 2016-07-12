/* eslint-env jasmine */
'use strict'

describe('entry point', () => {
  it('should take a config object', () => {
    const factories = require('../index')({firebase: 'some-firebase'})
    expect(factories.define).toEqual(jasmine.any(Function))
    expect(factories.reset).toEqual(jasmine.any(Function))
  })
})
