class WishesAPI {
  #categoryPendingWishesQuery;
  #prevPendingWishesDoc;
  #npoWishesQuery;
  #prevNPOWishesDoc;

  /**
   * Create a new wish
   * @param {string} title The wish title
   * @param {string} description The wish description
   * @param {array} categories A list of categories that the wish belongs to
   * @return {boolean} true if the wish is created, false otherwise
   */
  async create(title, description, categories) {}

  /**
   * Get the top X wishes belonging to a category that are pending, sorted by timestamp
   * @param {string} category The category name 
   * @param {number} limit The number of wishes to return
   * @throws {FirestoreError}
   * @returns {array} A list of X wishes sorted by timestamp
   */
  async getTopXWishes(category, limit) {}

  /**
   * Get pending wishes belonging to a category. Only return 21 results
   * @param {string} category The category's name
   * @param {string} orderBy The way to order the wishes
   * @throws {FirestoreError} 
   * @return {array} A list of ordered wishes belonging to a category
   */
  async getPendingWishes(category, orderBy) {}

  /**
   * Get the next batch of category wishes that was previously queried. Only return 21 results
   * @throws {ReferenceError}
   * @throws {FirestoreError}
   * @return {array} The ordered wishes belonging to a category 
   */
  async getNextBatchOfCategoryPendingWishes() {}

  /**
   * Get a wish by its id
   * @param {string} id 
   * @throws {FirestoreError}
   * @return {object} The wish info
   */
  async getWish(id) {}

  /**
   * Get wishes belonging to a NPO. Only return 21 results
   * @param {string} npoID 
   * @return {array} A list of wishes belonging to a NPO
   */
  async getNPOWishes(npoID) {}

  /**
   * Get the next batch of NPO wishes that was previously queried. Only return 21 results
   * @return {array} A list of wishes belonging to a NPO
   */
  async getNextBatchOfNPOWishes() {}

  /**
   * Update the fields of the wishes. Does not include updating of status
   * @param {string} id The wish id
   * @param {object} data The data to update to
   * @return {boolean} true if the wish field/s is updated, false otherwise
   */
  async updateWish(id, data)
  
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

export default WishesAPI