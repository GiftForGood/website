class AuthAPI {
  /**
   * Register a donor with Google
   * @throws {Error}
   * @return {object} The donor's info
   */
  async registerDonorWithGoogle() {}

  /**
   * Register a donor with email and password
   * @param {string}  email
   * @param {string}  password
   * @throws {Error}
   * @return {object} The donor's info
   */
  async registerDonorWithEmailAndPassword(email, password) {}

  /**
   * Register a NPO
   * @param {string}  name
   * @param {number}  contact
   * @param {string}  email
   * @param {string}  password
   * @param {string}  organizationName
   * @param {string}  registeredUnder
   * @param {object}  dateOfRegistration
   * @param {string}  proofImageUrl
   * @param {string}  activities
   * @throws {Error}
   * @return {object} The NPO's info
   */
  async registerNPO(
    name,
    contact,
    email,
    password,
    organizationName,
    registeredUnder,
    dateOfRegistration,
    proofImageUrl,
    activities
  ) {}

  /**
   * Sign in a donor with Google
   * @throws {Error}  Failed to login donor
   * @return {object}     The donor's info
   */
  async loginDonorWithGoogle() {}

  /**
   * Sign in a donor with email and password
   * @param {string}  email
   * @param {string}  password
   * @throws {Error}
   * @return {object} The donor's info
   */
  async loginDonorWithEmailAndPassword(email, password) {}

  /**
   *
   * @param {string}  email
   * @param {string}  password
   * @throws {Error}
   * @return {object} The NPO's info
   */
  async loginNPO(email, password) {}

  /**
   * Logout a user (donor & NPO)
   * @throws {Error}
   */
  async logout() {}
}

export default AuthAPI;
