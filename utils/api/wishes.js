class WishesAPI {
  /**
   * Create a new wish
   * @param {string} title The wish title
   * @param {string} description The wish description
   * @param {array} categories A list of categories that the wish belongs to
   * @return {boolean} true if the wish is created, false otherwise
   */
  async create(title, description, categories) {}

  /**
   * Search wishes containing the text both in the title and description
   * @param {string} text
   * @return {object} A firebase document of wishes that contain the text
   */
  async search(text) {}

  /**
   * Get the top X pending wishes belonging to a category, sorted by timestamp
   * @param {string} category The category name
   * @param {number} n The number of wishes to return
   * @return {object} A firebase document of the top n pending wishes
   */
  async getTopNPendingWishes(category, n) {}

  /**
   * Get the initial batch of pending wishes belonging to a category. Only return results of WISHES_BATCH_SIZE
   * @param {string} category The category's name
   * @param {string} orderBy The way to order the wishes
   * @param {boolean} isReverse Indicates if the query should be ordered in reverse
   * @param {object} previousDocument The previous firebase document to start the query after. If the field is not given, the query will start from the first document
   * @return {object} A firebase document of ordered pending wishes belonging to a category
   */
  async getPendingWishesForCategory(category, orderBy, isReverse, previousDocument = null) {}

  /**
   * Get a wish by its id
   * @param {string} id The wish id
   * @return {object} A firebase document of the wish info
   */
  async getWish(id) {}

  /**
   * Get the initial batch of wishes belonging to a NPO. Only return results of WISHES_BATCH_SIZE
   * @param {string} npoID
   * @param {object} previousDocument The previous firebase document to start the query after. If the field is not given, the query will start from the first document
   * @return {object} A firebase document of wishes belonging to a NPO
   */
  async getNPOWishes(npoID, previousDocument = null) {}

  /**
   * Get the initial batch of wishes belonging to a NPO filter by its status. Only return results of WISHES_BATCH_SIZE
   * @param {string} npoID
   * @param {string} status The status of the wishes
   * @param {object} previousDocument The previous firebase document to start the query after. If the field is not given, the query will start from the first document
   * @return {object} A firebase document of wishes belonging to a NPO, filtered by status
   */
  async getNPOWishesFilterByStatus(npoID, status, previousDocument = null) {}

  /**
   * Get the initial batch of wishes that are completed by a donor. Only return results of WISHES_BATCH_SIZE
   * @param {string} donorID
   * @param {object} previousDocument The previous firebase document to start the query after. If the field is not given, the query will start from the first document
   * @return {object} AA firebase document of wishes that a completed by a donor
   */
  async getDonorCompletedWishes(donorID, previousDocument = null) {}

  /**
   * Update the fields of a wish. Does not include updating of status
   * @param {string} id The wish id
   * @param {object} data The data to update to
   * @return {boolean} true if the wish field/s is updated, false otherwise
   */
  async updateWish(id, data) {}

  /**
   * Bump a wish
   * @param {string} id The wish id
   * @return {boolean} true if the wish is bumped successfully, false otherwise
   */
  async bumpWish(id) {}

  /**
   * Close a wish
   * @param {string} id The wish id
   * @param {string} reason The reason for closing
   * @return {boolean} true if the wish is closed successfully, false otherwise
   */
  async closeWish(id, reason) {}

  /**
   * Complete a wish
   * @param {string} id The wish id
   * @param {string} donorID The donor id that completed the wish
   * @return {boolean} true if the wish is completed successfully, false otherwise
   */
  async completeWish(id, donorID) {}
}

export default WishesAPI;
