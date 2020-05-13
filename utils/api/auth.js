class AuthAPI {
  /**
   * Register a donor with Google
   * @return {object} A firebase document of the donor info
   */
  async registerDonorWithGoogle() {}

  /**
   * Register a donor with email and password
   * @param {string} email
   * @param {string} password
   * @return {object} A firebase document of the donor info
   */
  async registerDonorWithEmailAndPassword(email, password) {}

  /**
   * Register a NPO
   * @param {string} name
   * @param {number} contact
   * @param {string} email
   * @param {string} password
   * @param {string} organizationName
   * @param {string} registeredUnder
   * @param {object} dateOfRegistration
   * @param {string} proofImageUrl
   * @param {string} activities
   * @return {object} A firebase document of the NPO info
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
   * @return {object} A firebase document of the donor info
   */
  async loginDonorWithGoogle() {}

  /**
   * Sign in a donor with email and password
   * @param {string} email
   * @param {string} password
   * @return {object} A firebase document of the donor info
   */
  async loginDonorWithEmailAndPassword(email, password) {}

  /**
   * Sign in a NPO
   * @param {string} email
   * @param {string} password
   * @return {object} A firebase document of the NPO info
   */
  async loginNPO(email, password) {}

  /**
   * Login through session
   * @param {string} token The firebase token
   */
  async silentLogin(token) {}

  /**
   * Logout a user (donor & NPO)
   */
  async logout() {}
}

export default AuthAPI;
