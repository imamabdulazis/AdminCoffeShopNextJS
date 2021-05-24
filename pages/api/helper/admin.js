var admin = require('firebase-admin');
var serviceAccount = require('./service_account.json');

const config = require('../utils/firebase');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: config.storageBucket,
});

module.exports = admin;