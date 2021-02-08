import admin from '@utils/admin-firebase';

export const deserializeFirestoreTimestampToUnixTimestampNode = (...objects) => {
  for (let object of objects) {
    for (let [key, value] of Object.entries(object)) {
      if (value instanceof admin.firestore.Timestamp) {
        object[key] = value.toMillis();
      } else if (value instanceof Object) {
        deserializeFirestoreTimestampToUnixTimestampNode(value);
      }
    }
  }
};
