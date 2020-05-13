class DonationsAPI {
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
   * @return {object} A firebase document of donations that contain the text
   */
  async search(text) {}

  /**
   * Get the top X pending donations belonging to a category, sorted by timestamp
   * @param {string} category The category name
   * @param {number} n The number of donations to return
   * @returns {object} A firebase document of the top n pending donations
   */
  async getTopNPendingDonations(category, n) {}

  /**
   * Get the initial batch of pending donations belonging to a category. Only return results of DONATIONS_BATCH_SIZE
   * @param {string} category The category's name
   * @param {string} orderBy The way to order the donations
   * @param {boolean} isReverse Indicates if the query should be ordered in reverse
   * @param {object} previousDocument The previous firebase document to start the query after. If the field is not given, the query will start from the first document
   * @return {object} A firebase document of ordered pending donations belonging to a category
   */
  async getPendingDonationsForCategory(category, orderBy, isReverse, previousDocument = null) {}

  /**
   * Get a donation by its id
   * @param {string} id
   * @return {object} A firebase document of the donation info
   */
  async getDonation(id) {}

  /**
   * Get the initial batch of donations belonging to a donor. Only return DONATIONS_BATCH_SIZE results
   * @param {string} donorID
   * @param {object} previousDocument The previous firebase document to start the query after. If the field is not given, the query will start from the first document
   * @return {object} A firebase document of donations belonging to a NPO
   */
  async getDonorDonations(donorID, previousDocument = null) {}

  /**
   * Get the initial batch of donations belonging to a donor filter by its status. Only return DONATIONS_BATCH_SIZE results
   * @param {string} npoID
   * @param {string} status The status of the donations
   * @param {object} previousDocument The previous firebase document to start the query after. If the field is not given, the query will start from the first document
   * @return {object} A firebase document of donations belonging a donor, filtered by status
   */
  async getDonorDonationsFilterByStatus(donorID, status, previousDocument = null) {}

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
