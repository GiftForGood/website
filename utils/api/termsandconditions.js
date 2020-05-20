import { db } from '../firebase';

const termsAndConditionsCollection = db.collection('termsandconditions');

class TermsAndConditionsAPI {
  /**
   * Get the latest terms and condition
   * @throws {FirebaseError}
   * @return {object} A firebase document of the terms and condition
   */
  async get() {
    let snapshot = await termsAndConditionsCollection.orderBy('createdAt', 'desc').limit(1).get();
    if (snapshot.empty) {
      return {};
    }
    return snapshot.docs[0];
  }
}

export default TermsAndConditionsAPI;
