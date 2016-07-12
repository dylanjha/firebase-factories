/* eslint-env jasmine */

'use strict'

describe('counter', () => {
  it('should keep the count', () => {
    const counter = require('../../lib/counter')
    const initial = counter.setup('key')
    expect(initial).toEqual(0)
    const next = counter.increment('key')
    expect(next).toEqual(1)
    const reset = counter.reset('key')
    expect(reset).toEqual(0)
  })
})
