'use strict'

const MAP = {}

module.exports = {
  setup: (name) => {
    MAP[name] = 0
    return MAP[name]
  },
  increment: (name) => {
    if (!MAP.hasOwnProperty(name)) { throw new Error(`Missing counter for ${name}`) }
    MAP[name] += 1
    return MAP[name]
  },
  reset: (name) => {
    MAP[name] = 0
    return MAP[name]
  }
}
