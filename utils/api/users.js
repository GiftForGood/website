class UsersAPI {
  /**
   * Gets the current logged in user id
   * @throws {ReferenceError} No logged in user
   * @return {string} The current logged in user id
   */
  currentUserID() {}

  /**
   * Gets the current logged in user info
   * @throws {ReferenceError} No logged in user
   * @return {object} The current logged in user info
   */
  async currentUser() {}

  /**
   * Update fields of current logged in user
   * @param {object} data The data to update to
   * @return {boolean} true if the current user info is updated successfully, false otherwise
   */
  async updateCurrentUser(data) {}

  /**
   * Get a user info by its id
   * @param {string} id The user id to search by
   * @throws {FirestoreError}
   * @return {object} The user info
   */
  async getUser(id) {}
}

export default UsersAPI;
