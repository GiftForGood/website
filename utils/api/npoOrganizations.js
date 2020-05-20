import { db } from '../firebase';

const npoOrganizationsCollection = db.collection('npoOrganizations');

class NPOOrganizationAPI {
  /**
   * Get all the NPO Organizations
   * @throws {FirebaseError}
   * @return {object} A firebase document of all the npo organizations
   */
  async getAll() {
    return npoOrganizationsCollection.orderBy('name', 'asc').get();
  }

  /**
   * Get a NPO organization info by it's name
   * @param {string} name The NPO organization name
   * @throws {FirebaseError}
   * @return {object} A firebase document of the NPO organization info
   */
  async get(name) {
    return npoOrganizationsCollection.where('name', '==', name).get();
  }
}

export default NPOOrganizationAPI;
