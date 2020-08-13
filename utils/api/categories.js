import { db } from '../firebase';

const categoriesCollection = db.collection('categories');

class CategoriesAPI {
  /**
   * Get all the categories
   * @throws {FirebaseError}
   * @return {object} A firebase document of all the categories
   */
  async getAll() {
    return categoriesCollection.where('shouldShow', '==', true).orderBy('name', 'asc').get();
  }

  /**
   * Get a category by its id
   * @param {string} id The category id
   * @throws {FirebaseError}
   * @return {object} A firebase document of the category info
   */
  async getById(id) {
    return categoriesCollection.doc(id).get();
  }
}

export default CategoriesAPI;
