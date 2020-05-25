import { db, firebaseAuth, firebaseStorage } from '../firebase';
import firebase from 'firebase/app';
import * as moment from 'moment';
import * as path from 'path';
import {
  REGISTRY_OF_SOCIETIES,
  COMMISSIONER_OF_CHARITIES,
  AFFILIATED_NATIONAL_COUNCIL_OF_SOCIAL_SERVICE,
} from '../constants/npoRegisteredRegistrar.js';
import AuthError from './error/authError';
import { FIREBASE_EMAIL_ACTION_URL } from '../constants/siteUrl';

const donorsCollection = db.collection('donors');
const nposCollection = db.collection('npos');

class AuthAPI {
  /**
   * Register a donor with Google
   * @throws {FirebaseError}
   * @throws {AuthError}
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
   * @throws {FirebaseError}
   * @throws {AuthError}
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
   * @param {string} name The name of the NPO
   * @param {number} contact The contact of the NPO
   * @param {string} email The email of the NPO
   * @param {string} password The password of the NPO
   * @param {string} organizationName The organization that the NPO belongs to
   * @param {string} registeredRegistrar The registrar the the NPO is registered with
   * @param {string} registrationNumber The registration number
   * @param {string} dayOfRegistration The date when the NPO is registered with the registrar (day)
   * @param {string} monthOfRegistration The date when the NPO is registered with the registrar (day)
   * @param {string} yearOfRegistration The date when the NPO is registered with the registrar (day)
   * @param {string} proofImage The image of the proof
   * @param {string} activities The description of the type of activities that the NPO does
   * @return {array} [token, userProfile, userDoc]
   *  token: JWT
   *  userProfile: The user profile
   *  userDoc: Firebase document that contains the userInfo in the db
   */
  async registerNPO(
    name,
    contact,
    email,
    password,
    organizationName,
    registeredRegistrar,
    registrationNumber,
    dayOfRegistration,
    monthOfRegistration,
    yearOfRegistration,
    proofImage,
    activities
  ) {
    this._validateNPOData(registeredRegistrar, proofImage);
    await firebaseAuth.createUserWithEmailAndPassword(email, password);
    const token = await firebaseAuth.currentUser.getIdToken();
    const userProfile = firebaseAuth.currentUser;
    const userDoc = await this._createNPO(userProfile, name, contact, organizationName);
    await this._createNPOVerificationData(
      userProfile,
      name,
      contact,
      organizationName,
      registeredRegistrar,
      registrationNumber,
      dayOfRegistration,
      monthOfRegistration,
      yearOfRegistration,
      proofImage,
      activities
    );

    return [token, userProfile, userDoc];
  }

  /**
   * Sign in a donor with Google
   * @throws {FirebaseError}
   * @throws {AuthError}
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
   * @throws {FirebaseError}
   * @throws {AuthError}
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
   * @return {array} [token, userProfile, userDoc]
   *  token: JWT
   *  userProfile: The user profile
   *  userDoc: Firebase document that contains the userInfo in the db
   */
  async loginNPO(email, password) {
    await firebaseAuth.signInWithEmailAndPassword(email, password);
    const token = await firebaseAuth.currentUser.getIdToken();
    const userProfile = firebaseAuth.currentUser;
    const userDoc = await this._getNPODoc(userProfile.uid);

    return [token, userProfile, userDoc];
  }

  /**
   * Send a verification email to the currently logged in user
   */
  async sendVerificationEmail() {
    let url = FIREBASE_EMAIL_ACTION_URL + '/';
    const actionCodeSettings = {
      url: url,
    };

    const user = firebaseAuth.currentUser;
    return user.sendEmailVerification(actionCodeSettings);
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
      throw new AuthError('unable-to-create-user', 'No user profile');
    }

    if (await this._doesDonorExist(userInfo.uid)) {
      throw new AuthError('unable-to-create-user', 'Donor account already exists');
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

    const newDonor = donorsCollection.doc(userInfo.uid);
    const timeNow = Date.now();
    const data = {
      userId: userInfo.uid,
      name: name,
      profileImageUrl: profileImageUrl,
      numberOfReviews: 0,
      reviewRating: 0,
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
      throw new AuthError('invalid-user', 'No such donor account');
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

  _validateNPOData(registeredRegistrar, proofImage) {
    this._validateRegistrar(registeredRegistrar);
    this._validateProofImage(proofImage);
  }

  _validateRegistrar(registeredRegistrar) {
    const validRegistrar = [
      AFFILIATED_NATIONAL_COUNCIL_OF_SOCIAL_SERVICE,
      REGISTRY_OF_SOCIETIES,
      COMMISSIONER_OF_CHARITIES,
    ];

    if (!validRegistrar.includes(registeredRegistrar)) {
      throw new AuthError('invalid-arguments', registeredRegistrar + ' is not a valid registrar');
    }
  }

  _validateProofImage(proofImage) {
    const validExtensions = ['.pdf'];
    const imageExt = path.extname(proofImage.name);

    if (!validExtensions.includes(imageExt)) {
      throw new AuthError('invalid-arguments', imageExt + ' is not a valid file ext');
    }
  }

  async _createNPO(userProfile, name, contact, organizationName) {
    const organizationInfo = await this._getCategoryInfo(organizationName);

    const userId = userProfile.uid;
    const newNPO = nposCollection.doc(userId);
    const timeNow = Date.now();
    const data = {
      userId: userId,
      name: name,
      contactNumber: contact,
      profileImageUrl: '',
      organization: organizationInfo,
      numberOfReviews: 0,
      reviewRating: 0,
      isVerifiedByAdmin: false,
      hasAcceptedTermsOfService: true,
      isBlocked: false,
      isForcedRefreshRequired: false,
      joinedDateTime: timeNow,
      lastLoggedInDateTime: timeNow,
    };
    await newNPO.set(data);
    return newNPO;
  }

  async _createNPOVerificationData(
    userProfile,
    name,
    contact,
    organizationName,
    registeredRegistrar,
    registrationNumber,
    dayOfRegistration,
    monthOfRegistration,
    yearOfRegistration,
    proofImage,
    activities
  ) {
    const organizationInfo = await this._getCategoryInfo(organizationName);
    const uploadedImage = await this._uploadNPOProofImage(userProfile.uid, proofImage);
    const imagePath = uploadedImage.metadata.fullPath;
    const dateOfRegistration = dayOfRegistration + '-' + monthOfRegistration + '-' + yearOfRegistration;

    const organization = {
      ...organizationInfo,
      registeredRegistrar: registeredRegistrar,
      registrationNumber: registrationNumber,
      dateOfRegistration: moment(dateOfRegistration, 'DD-MM-YYYY').valueOf(),
      proofImageUrl: imagePath,
      activities: activities,
    };
    const newVerificationData = db.collection('npoVerifications').doc(userProfile.uid);
    const data = {
      userId: userProfile.uid,
      name: name,
      contactNumber: contact,
      organization: organization,
      isVerifiedByAdmin: false,
    };
    await newVerificationData.set(data);
    return newVerificationData;
  }

  async _getNPODoc(id) {
    const snapshot = await nposCollection.where('userId', '==', id).get();

    if (snapshot.empty) {
      throw new AuthError('invalid-user', 'No such NPO account');
    }

    return snapshot.docs[0];
  }

  async _uploadNPOProofImage(npoId, proofImage) {
    const ext = path.extname(proofImage.name);
    const storageRef = firebaseStorage.ref();
    const proofImageRef = storageRef.child(`npos/${npoId}/proofs/${npoId}_proof_v1${ext}`);
    return await proofImageRef.put(proofImage);
  }

  async _getCategoryInfo(name) {
    const snapshot = await db.collection('npoOrganizations').where('name', '==', name).get();

    if (snapshot.empty) {
      return {};
    }

    return snapshot.docs[0].data();
  }
}

export default AuthAPI;
