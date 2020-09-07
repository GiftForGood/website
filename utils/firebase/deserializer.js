import { firebase } from '@utils/firebase';

export const deserializeFirestoreTimestampToUnixTimestamp = (...objects) => {
  for (let object of objects) {
    for (let [key, value] of Object.entries(object)) {
      if (value instanceof firebase.firestore.Timestamp) {
        object[key] = value.toMillis();
      } else if (value instanceof Object) {
        deserializeFirestoreTimestampToUnixTimestamp(value);
      }
    }
  }
};
