class DonationsAPI {
	#pendingDonationsForCategoryQuery;
	#prevPendingDonationsForCategoryDoc;
	#donorDonationsQuery;
	#prevDonorDonationsDoc;
	#donorDonationsByStatusQuery;
	#prevDonorDonationsByStatusDoc;
	#completedNPODonationsQuery;
	#prevCompletedNPODonationsDoc;

	/**
	 * Create a new donation
	 * @param {string} title The donation title
	 * @param {string} description The donation description
	 * @param {array} categories A list of categories that the donation belongs to
	 * @param {object} validPeriodFrom The valid date that the donation is valid from
	 * @param {object} validPeriodTo The valid date that the donation is valid to
	 * @param {string} dimensions The dimension of the donated item
	 * @param {string} location The location of the donation
	 * @param {string} itemCondition The condition of the donated item
	 * @param {string} coverImagePath The path of the cover image for the donation
	 * @param {array} imagesPath A list of path of the images for the donations. Should include the cover image path
	 * @return {boolean} true if the donation is created, false otherwise
	 */
	async create(
		title,
		description,
		categories,
		validPeriodFrom,
		validPeriodTo,
		dimensions,
		location,
		itemCondition,
		coverImagePath,
		imagesPath
	) {}

	/**
	 * Search donations containing the text both in the title and description
	 * @param {string} text
	 * @throws {FirestoreError}
	 * @return {array} A list of donations that contain the text
	 */
	async search(text) {}

	/**
	 * Get the top X pending donations belonging to a category, sorted by timestamp
	 * @param {string} category The category name
	 * @param {number} limit The number of donations to return
	 * @throws {FirestoreError}
	 * @returns {array} A list of X pending donations, sorted by timestamp
	 */
	async getTopXPendingDonations(category, limit) {}

	/**
	 * Get the initial batch of pending donations belonging to a category. Only return DONATIONS_BATCH_SIZE results
	 * @param {string} category The category's name
	 * @param {string} orderBy The way to order the donations
	 * @throws {FirestoreError}
	 * @return {array} A list of ordered donations belonging to a category
	 */
	async getInitialBatchOfPendingDonationsForCategory(category, orderBy) {}

	/**
	 * Get the next batch of pending donations belonging to a category that was previously queried. Only return DONATIONS_BATCH_SIZE results
	 * @throws {ReferenceError}
	 * @throws {FirestoreError}
	 * @return {array} The ordered donations belonging to a category
	 */
	async getNextBatchOfPendingDonationsForCategory() {}

	/**
	 * Get a donation by its id
	 * @param {string} id
	 * @throws {FirestoreError}
	 * @return {object} The donation info
	 */
	async getDonation(id) {}

	/**
	 * Get the initial batch of donations belonging to a donor. Only return DONATIONS_BATCH_SIZE results
	 * @param {string} donorID
	 * @return {array} A list of donations belonging to a NPO
	 */
	async getInitialBatchOfDonorDonations(donorID) {}

	/**
	 * Get the next batch of donor donations that was previously queried. Only return DONATIONS_BATCH_SIZE results
	 * @throws {ReferenceError}
	 * @throws {FirestoreError}
	 * @return {array} A list of donations belonging to a donor
	 */
	async getNextBatchOfDonorDonations() {}

	/**
	 * Get the initial batch of donations belonging to a donor filter by its status. Only return DONATIONS_BATCH_SIZE results
	 * @param {string} npoID
	 * @param {string} status The status of the donations
	 * @throws {FirestoreError}
	 * @return {array} A list of donations belonging donor, filtered by status
	 */
	async getInitialBatchOfDonorDonationsFilterByStatus(donorID, status) {}

	/**
	 * Get the next batch of donations belonging to a donor filter by its status. Only return DONATIONS_BATCH_SIZE results
	 * @throws {ReferenceError}
	 * @throws {FirestoreError}
	 * @return {array} A list of donations belonging to a donor, filtered by status
	 */
	async getNextBatchOfDonorDonationsFilterByStatus() {}

	/**
	 * Get the initial batch of donations that are completed by a NPO. Only return DONATIONS_BATCH_SIZE results
	 * @param {string} npoID
	 * @throws {FirestoreError}
	 * @return {array} A list of donations that are completed by a NPO
	 */
	async getInitialBatchOfNPOCompletedDonations(npoID) {}

	/**
	 * Get the next batch of donations completed by a NPO that was previously queried. Only return DONATIONS_BATCH_SIZE results
	 * @throws {ReferenceError}
	 * @throws {FirestoreError}
	 * @return {array} A list of donations that are completed by a NPO
	 */
	async getNextBatchOfNPOCompletedDonations() {}

	/**
	 * Update the fields of a donation. Does not include updating of status
	 * @param {string} id The donation id
	 * @param {object} data The data to update to
	 * @return {boolean} true if the donation field/s is updated, false otherwise
	 */
	async updateDonation(id, data) {}

	/**
	 * Close a donation
	 * @param {string} id The donation id
	 * @param {string} reason The reason for closing
	 * @return {boolean} true if the donation is closed successfully, false otherwise
	 */
	async closeDonation(id, reason) {}

	/**
	 * Complete a donation
	 * @param {string} id The donation id
	 * @param {string} npoID The NPO id that completed the donation
	 * @return {boolean} true if the donation is completed successfully, false otherwise
	 */
	async completeDonation(id, npoID) {}
}

export default DonationsAPI;
