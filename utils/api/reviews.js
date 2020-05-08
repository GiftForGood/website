class ReviewsAPI {
  /**
   *
   * @param {string} wishID The wish id that is being reviewed
   * @param {string} npoID The NPO id that owns the wish
   * @param {string} donorID The donor id that fulfilled the wish
   * @param {number} rating The rating given by the NPO to the donor
   * @param {string} review The review given by the NPO to the donor
   */
  async createWishReview(wishID, npoID, donorID, rating, review) {}

  /**
   *
   * @param {string} donationID The donation id that is being reviewed
   * @param {string} donorID The donor id that owns the donation
   * @param {string} npoID The npo id that is requested for the donation
   * @param {number} rating The rating given by the donor to the NPO
   * @param {string} review The review given by the donor to the NPO
   */
  async createDonationReview(donationID, donorID, npoID, rating, review) {}
}

export default ReviewsAPI;
