'use strict'

const HOST = 'localhost.firebaseio.test'
const PORT = 5000

const Firebase = require('firebase')
const FirebaseServer = require('firebase-server')
// start firebase server
new FirebaseServer(PORT, HOST) // eslint-disable-line no-new
const firebase = new Firebase(`ws://${HOST}:${PORT}`)

require('../../config')({firebase: firebase})
