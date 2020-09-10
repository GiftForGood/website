import { db } from '../firebase';

const partnersCollection = db.collection('partners');

class PartnersAPI {
  /**
   * Get all the partners
   * @throws {FirebaseError}
   * @return {object} A firebase document of all partners
   */
  async getAll() {
    return partnersCollection.orderBy('name', 'asc').get();
  }
}

export default PartnersAPI;
