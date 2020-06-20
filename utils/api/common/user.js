import { firebaseAuth } from '../../firebase';

export const getCurrentUser = (auth) => {
  return new Promise((resolve, reject) => {
     const unsubscribe = firebaseAuth.onAuthStateChanged(user => {
        unsubscribe();
        resolve(user);
     }, reject);
  });
}