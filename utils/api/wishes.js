class WishesAPI {
  #pendingWishesForCategoryQuery;
  #prevPendingWishesForCategoryDoc;
  #npoWishesQuery;
  #prevNPOWishesDoc;
  #npoWishesByStatusQuery;
  #prevNPOWishesByStatusDoc;
  #completedDonorWishesQuery;
  #prevCompletedDonorWishesDoc;

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
   * @throws {FirestoreError}
   * @return {array} A list of wishes that contain the text
   */
  async search(text) {}

  /**
   * Get the top X pending wishes belonging to a category, sorted by timestamp
   * @param {string} category The category name
   * @param {number} limit The number of wishes to return
   * @throws {FirestoreError}
   * @return {array} A list of X pending wishes, sorted by timestamp
   */
  async getTopXPendingWishes(category, limit) {}

  /**
   * Get the initial batch of pending wishes belonging to a category. Only return WISHES_BATCH_SIZE results
   * @param {string} category The category's name
   * @param {string} orderBy The way to order the wishes
   * @throws {FirestoreError}
   * @return {array} A list of ordered wishes belonging to a category
   */
  async getInitialBatchOfPendingWishesForCategory(category, orderBy) {}

  /**
   * Get the next batch of pending wishes belonging to a category that was previously queried. Only return WISHES_BATCH_SIZE results
   * @throws {ReferenceError}
   * @throws {FirestoreError}
   * @return {array} The ordered wishes belonging to a category
   */
  async getNextBatchOfPendingWishesForCategory() {}

  /**
   * Get a wish by its id
   * @param {string} id The wish id
   * @throws {FirestoreError}
   * @return {object} The wish info
   */
  async getWish(id) {}

  /**
   * Get the initial batch of wishes belonging to a NPO. Only return WISHES_BATCH_SIZE results
   * @param {string} npoID
   * @return {array} A list of wishes belonging to a NPO
   */
  async getInitialBatchOfNPOWishes(npoID) {}

  /**
   * Get the next batch of NPO wishes that was previously queried. Only return WISHES_BATCH_SIZE results
   * @throws {ReferenceError}
   * @throws {FirestoreError}
   * @return {array} A list of wishes belonging to a NPO
   */
  async getNextBatchOfNPOWishes() {}

  /**
   * Get the initial batch of wishes belonging to a NPO filter by its status. Only return WISHES_BATCH_SIZE results
   * @param {string} npoID
   * @param {string} status The status of the wishes
   * @throws {FirestoreError}
   * @return {array} A list of wishes belonging NPO, filtered by status
   */
  async getInitialBatchOfNPOWishesFilterByStatus(npoID, status) {}

  /**
   * Get the next batch of wishes belonging to a NPO filter by its status. Only return WISHES_BATCH_SIZE results
   * @throws {ReferenceError}
   * @throws {FirestoreError}
   * @return {array} A list of wishes belonging to a NPO, filtered by status
   */
  async getNextBatchOfNPOWishesFilterByStatus() {}

  /**
   * Get the initial batch of wishes that are completed by a donor. Only return WISHES_BATCH_SIZE results
   * @param {string} donorID
   * @throws {FirestoreError}
   * @return {array} A list of wishes that are completed by a donor
   */
  async getInitialBatchOfDonorCompletedWishes(donorID) {}

  /**
   * Get the next batch of wishes completed by a donor that was previously queried. Only return WISHES_BATCH_SIZE results
   * @throws {ReferenceError}
   * @throws {FirestoreError}
   * @return {array} A list of wishes that are completed by a donor
   */
  async getNextBatchOfDonorCompletedWishes() {}

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
