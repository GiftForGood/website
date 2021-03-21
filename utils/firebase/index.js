import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/database';
import 'firebase/storage';
import 'firebase/remote-config';

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

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const firebaseAuth = firebase.auth();
const db = firebase.firestore();
const firebaseStorage = firebase.storage();

// Use emulator when it's localhost
if (process.env.NODE_ENV === 'development') {
  db.useEmulator('localhost', 8080); // firestore
  firebase.database().useEmulator('localhost', 9000); // Realtime Database
  if (process.env.ENABLE_AUTH_EMULATOR === 'true') {
    firebaseAuth.useEmulator('http://localhost:9099/'); // Auth
  }
}

// Remote config requires the browser to work due to caching.
let remoteConfig;
if (process.browser) {
  remoteConfig = firebase.remoteConfig();
  remoteConfig.settings = {
    minimumFetchIntervalMillis: 10000, // How often can it fetch? 10s once.
  };
}

export { firebaseAuth, db, firebaseStorage, firebase, remoteConfig };
