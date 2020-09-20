import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/database';
import 'firebase/storage';

var config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Use emulator when it's localhost (realtime)
if (process.env.NODE_ENV === 'development') {
  config['databaseURL'] = 'http://localhost:9000/?ns=giftforgood';
}

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const firebaseAuth = firebase.auth();
let db = firebase.firestore();
const firebaseStorage = firebase.storage();

// Use emulator when it's localhost (firestore)
if (process.env.NODE_ENV === 'development') {
  db.settings({
    host: 'localhost:8080',
    ssl: false,
  });
}

export { firebaseAuth, db, firebaseStorage, firebase };
