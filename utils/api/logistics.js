import { db } from '../firebase';

const logisticsCollection = db.collection('logistics');

class LogisticsAPI {
  /**
   * Get all the logistic partners
   * @throws {FirebaseError}
   * @return {object} A firebase document of all the logistic partners
   */
  async getAll() {
    return logisticsCollection.orderBy('name', 'asc').get();
  }
}

export default LogisticsAPI;
