var admin = require("firebase-admin");
var serviceAccount = require("./service_account.json");

const config = require("@utils/firebase");

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: config.storageBucket,
  });
}

module.exports = admin;
