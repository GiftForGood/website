let BASE_URL = '';
let FIREBASE_EMAIL_ACTION_URL = '';

if (process.env.NODE_ENV === 'development') {
  BASE_URL = 'http://localhost:3000';
  FIREBASE_EMAIL_ACTION_URL = 'http://localhost:3000/';
} else {
  BASE_URL = 'https://giftforgood.io';
  FIREBASE_EMAIL_ACTION_URL = 'https://giftforgood.io';
}

export { BASE_URL, FIREBASE_EMAIL_ACTION_URL };
