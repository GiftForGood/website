import { db, firebaseAuth } from '../firebase';
import firebase from 'firebase/app';

const donorsCollection = db.collection('donors');

class AuthAPI {
  /**
   * Register a donor with Google
   * @throws
   * @return {array} [token, userProfile, userDoc]
   *  token: JWT
   *  userProfile: The user profile
   *  userDoc: Firebase document that contains the userInfo in the db
   */
  async registerDonorWithGoogle() {
    await this._googleAuth();
    const token = await firebaseAuth.currentUser.getIdToken();
    const userProfile = firebaseAuth.currentUser;
    const userDoc = await this._createDonor(userProfile);

    return [token, userProfile, userDoc];
  }

  /**
   * Register a donor with email and password
   * @param {string} email
   * @param {string} password
   * @throws
   * @return {array} [token, userProfile, userDoc]
   *  token: JWT
   *  userProfile: The user profile
   *  userDoc: Firebase document that contains the userInfo in the db
   */
  async registerDonorWithEmailAndPassword(email, password) {
    await firebaseAuth.createUserWithEmailAndPassword(email, password);
    const token = await firebaseAuth.currentUser.getIdToken();
    const userProfile = firebaseAuth.currentUser;
    const userDoc = await this._createDonor(userProfile);

    return [token, userProfile, userDoc];
  }

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
   * @throws
   * @return {array} [token, userProfile, userDoc]
   *  token: JWT
   *  userProfile: The user profile
   *  userDoc: Firebase document that contains the userInfo in the db
   */
  async loginDonorWithGoogle() {
    await this._googleAuth();
    const token = await firebaseAuth.currentUser.getIdToken();
    const userProfile = firebaseAuth.currentUser;
    const userDoc = await this._getDonorDoc(userProfile.uid);

    return [token, userProfile, userDoc];
  }

  /**
   * Sign in a donor with email and password
   * @param {string} email
   * @param {string} password
   * @throws
   * @return {array} [token, userProfile, userDoc]
   *  token: JWT
   *  userProfile: The user profile
   *  userDoc: Firebase document that contains the userInfo in the db
   */
  async loginDonorWithEmailAndPassword(email, password) {
    await firebaseAuth.signInWithEmailAndPassword(email, password);
    const token = await firebaseAuth.currentUser.getIdToken();
    const userProfile = firebaseAuth.currentUser;
    const userDoc = await this._getDonorDoc(userProfile.uid);

    return [token, userProfile, userDoc];
  }

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
   * @throws
   */
  async silentLogin(token) {
    let decodedToken = await firebaseAuth.verifyIdToken(token);
    return decodedToken;
  }

  /**
   * Send a verification email to the currently logged in user
   */
  async sendVerificationEmail() {
    const user = firebaseAuth.currentUser;
    return user.sendEmailVerification();
  }

  /**
   * Logout a user (donor & NPO)
   */
  async logout() {
    firebaseAuth.signOut();
  }

  async _googleAuth() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return await firebaseAuth.signInWithPopup(provider);
  }

  async _createDonor(userInfo) {
    if (userInfo == null) {
      throw Error('No user profile created');
    }

    if (await this._doesDonorExist(userInfo.uid)) {
      throw Error('Donor account already exists');
    }

    let name = userInfo.displayName;
    let profileImageUrl = userInfo.photoURL;
    if (userInfo.displayName == null) {
      const email = userInfo.email;
      name = email.substring(0, email.lastIndexOf('@'));
    }
    if (userInfo.photoURL == null) {
      profileImageUrl = '';
    }

    const newDonor = donorsCollection.doc();
    const timeNow = Date.now();
    let data = {
      userId: userInfo.uid,
      name: name,
      profileImageUrl: profileImageUrl,
      reviewRating: 0,
      isVerifiedByEmail: false,
      hasAcceptedTermsOfService: true,
      isBlocked: false,
      isForcedRefreshRequired: false,
      joinedDateTime: timeNow,
      lastLoggedInDateTime: timeNow,
    };
    await newDonor.set(data);
    return newDonor;
  }

  async _getDonorDoc(id) {
    const snapshot = await donorsCollection.where('userId', '==', id).get();

    if (snapshot.empty) {
      throw Error('No such donor account');
    }

    return snapshot.docs[0];
  }

  async _doesDonorExist(id) {
    let snapshot = await donorsCollection.where('userId', '==', id).get();

    if (snapshot.empty) {
      return false;
    }

    return true;
  }
}

export default AuthAPI;
