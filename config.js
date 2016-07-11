'use strict'

let CONFIG = null
/*
  cache the CONFIG object in memory so we can re-require it
  accross files
*/
module.exports = (config) => {
  config = config || {}
  if (CONFIG) { return CONFIG }
  CONFIG = config
  return CONFIG
}
