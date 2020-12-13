const admin = require('firebase-admin');

let config = {
  credential: admin.credential.cert(require('./server-cert')),
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

if (!admin.apps.length) {
  admin.initializeApp(config);
}

export default admin;
