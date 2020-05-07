class ReportAPI {
  /**
   * Report a wish
   * @param {string} wishID The reported wish id
   * @param {string} userID The user who reported the wish. Can be donor or npo
   * @param {string} reason The reason for reporting a wish
   */
  async reportWish(wishID, userID, reason) {}

  /**
   * Report a donation
   * @param {string} donationID The reported donation id
   * @param {string} userId The user who reported the donation. Can be donor or npo
   * @param {string} reason The reason for reporting a donation
   */
  async reportDonation(donationID, userId, reason) {}
}

export default ReportAPI;
