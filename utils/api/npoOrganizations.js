import { db } from '../firebase';

const COLLECTION_NAME = "npoOrganizations";

class NPOOrganizationAPI {
  /**
   * Get all the NPO Organizations
   * @return {object} A firebase document of all the npo organizations
   */
  async getAll() {
    return db.collection(COLLECTION_NAME).get()
  }

  /**
   * Get a NPO organization info by it's name
   * @param {string} name The NPO organization name
   * @return {object} A firebase document of the NPO organization info
   */
  async get(name) {
    return db.collection(COLLECTION_NAME)
      .where('name', '==', name)
      .get()
  }
}

export default NPOOrganizationAPI;
