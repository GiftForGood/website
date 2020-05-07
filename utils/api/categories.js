class CategoriesAPI {
	/**
	 * Get all the categories
	 * @throws {FirestoreError}
	 * @return {array} A list of all the categories
	 */
	async getAll() {}

	/**
	 * Get a category by its id
	 * @param {string} id The category id
	 * @throws {FirestoreError}
	 * @return {object} The category's info
	 */
	async get(id) {}

	/**
	 * Get a category by its name
	 * @param {string} name The category name
	 * @throws {FirestoreError}
	 * @return {object} The category's info
	 */
	async get(name) {}
}

export default CategoriesAPI;
