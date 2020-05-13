import { db } from '../firebase';

const categoriesCollection = db.collection('categories');

class CategoriesAPI {
  /**
   * Get all the categories
   * @throws {FirebaseError}
   * @return {object} A firebase document of all the categories
   */
  async getAll() {
    return categoriesCollection.get();
  }

  /**
   * Get a category by its id
   * @param {string} id The category id
   * @throws {FirebaseError}
   * @return {object} A firebase document of the category info
   */
  async getById(id) {
    return categoriesCollection.where('id', '==', id).get();
  }

  /**
   * Get a category by its name
   * @param {string} name The category name
   * @throws {FirebaseError}
   * @return {object} A firebase document of the category info
   */
  async getByName(name) {
    return categoriesCollection.where('name', '==', name).get();
  }
}

export default CategoriesAPI;
