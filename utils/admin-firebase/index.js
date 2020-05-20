const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(require('./server-cert')),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
}

export default admin;
