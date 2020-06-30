import { db, firebaseAuth, firebaseStorage } from '../firebase';
import firebase from 'firebase/app';
import * as moment from 'moment';
import * as path from 'path';
import {
  REGISTRY_OF_SOCIETIES,
  COMMISSIONER_OF_CHARITIES,
  AFFILIATED_NATIONAL_COUNCIL_OF_SOCIAL_SERVICE,
} from '../constants/npoRegisteredRegistrar.js';
import { FIREBASE_EMAIL_ACTION_URL } from '../constants/siteUrl';
import { DONOR, NPO } from '../constants/usersType';
import { ALL_TEXT } from '../constants/imageVariation';
import AuthError from './error/authError';

const donorsCollection = db.collection('donors');
const nposCollection = db.collection('npos');
const usersCollection = db.collection('users');

class AuthAPI {
  /**
   * Register a donor with Google
   * @throws {FirebaseError}
   * @throws {AuthError}
   * @return {array} [token, userProfile, donorDoc]
   *  token: JWT
   *  userProfile: The user profile
   *  donorDoc: Firebase document that contains the userInfo in the db
   */
  async registerDonorWithGoogle() {
    await this._googleAuth();
    const token = await firebaseAuth.currentUser.getIdToken();
    const userProfile = firebaseAuth.currentUser;

    await this._validateDonor(userProfile);
    const [donorDoc, userDoc] = await Promise.all([
      this._createDonor(userProfile),
      this._createUser(userProfile.uid, DONOR),
    ]);

    return [token, userProfile, donorDoc];
  }

  /**
   * Register a donor with email and password
   * @param {string} email
   * @param {string} password
   * @throws {FirebaseError}
   * @throws {AuthError}
   * @return {array} [token, userProfile, donorDoc]
   *  token: JWT
   *  userProfile: The user profile
   *  donorDoc: Firebase document that contains the userInfo in the db
   */
  async registerDonorWithEmailAndPassword(email, password) {
    await firebaseAuth.createUserWithEmailAndPassword(email, password);
    const token = await firebaseAuth.currentUser.getIdToken();
    const userProfile = firebaseAuth.currentUser;

    await this._validateDonor(userProfile);
    const [donorDoc, userDoc] = await Promise.all([
      this._createDonor(userProfile),
      this._createUser(userProfile.uid, DONOR),
    ]);

    return [token, userProfile, donorDoc];
  }

  /**
   * Register a NPO
   * @param {string} name The name of the NPO
   * @param {number} contact The contact of the NPO
   * @param {string} email The email of the NPO
   * @param {string} password The password of the NPO
   * @param {string} organization The organization name that the NPO belongs to
   * @param {string} registeredRegistrar The registrar the the NPO is registered with. Reference to npoRegisteredRegistrar constant file
   * @param {string} registrationNumber The registration number
   * @param {string} dayOfRegistration The date when the NPO is registered with the registrar (day)
   * @param {string} monthOfRegistration The date when the NPO is registered with the registrar (day)
   * @param {string} yearOfRegistration The date when the NPO is registered with the registrar (day)
   * @param {string} proofImage The image of the proof
   * @param {string} activities The description of the type of activities that the NPO does
   * @throws {AuthError}
   * @return {array} [token, userProfile, npoDoc]
   *  token: JWT
   *  userProfile: The user profile
   *  npoDoc: Firebase document that contains the userInfo in the db
   */
  async registerNPO(
    name,
    contact,
    email,
    password,
    organization,
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

    await this._validateNPO(userProfile);
    const [npoDoc, userVerificationData, userDoc] = await Promise.all([
      this._createNPO(userProfile, name, contact, organization),
      this._createNPOVerificationData(
        userProfile,
        name,
        contact,
        organization,
        registeredRegistrar,
        registrationNumber,
        dayOfRegistration,
        monthOfRegistration,
        yearOfRegistration,
        proofImage,
        activities
      ),
      this._createUser(userProfile.uid, NPO),
    ]);

    return [token, userProfile, npoDoc];
  }

  /**
   * Sign in a donor with Google
   * @throws {FirebaseError}
   * @throws {AuthError}
   * @return {array} [token, userProfile, donorDoc]
   *  token: JWT
   *  userProfile: The user profile
   *  donorDoc: Firebase document that contains the userInfo in the db
   */
  async loginDonorWithGoogle() {
    await this._googleAuth();
    const token = await firebaseAuth.currentUser.getIdToken();
    const userProfile = firebaseAuth.currentUser;
    const donorDoc = await this._updateDonorLoginTime(userProfile.uid);

    return [token, userProfile, donorDoc];
  }

  /**
   * Sign in a donor with email and password
   * @param {string} email
   * @param {string} password
   * @throws {FirebaseError}
   * @throws {AuthError}
   * @return {array} [token, userProfile, donorDoc]
   *  token: JWT
   *  userProfile: The user profile
   *  donorDoc: Firebase document that contains the userInfo in the db
   */
  async loginDonorWithEmailAndPassword(email, password) {
    await firebaseAuth.signInWithEmailAndPassword(email, password);
    const token = await firebaseAuth.currentUser.getIdToken();
    const userProfile = firebaseAuth.currentUser;
    const donorDoc = await this._updateDonorLoginTime(userProfile.uid);

    return [token, userProfile, donorDoc];
  }

  /**
   * Sign in a NPO
   * @param {string} email
   * @param {string} password
   * @throws {AuthError}
   * @throws {FirebaseError}
   * @return {array} [token, userProfile, userDoc]
   *  token: JWT
   *  userProfile: The user profile
   *  userDoc: Firebase document that contains the userInfo in the db
   */
  async loginNPO(email, password) {
    await firebaseAuth.signInWithEmailAndPassword(email, password);
    const token = await firebaseAuth.currentUser.getIdToken();
    const userProfile = firebaseAuth.currentUser;
    const userDoc = await this._updateNPOLoginTime(userProfile.uid);

    return [token, userProfile, userDoc];
  }

  /**
   * Send a verification email to the currently logged in user
   * @throws {FirebaseError}
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
    let name = userInfo.displayName;
    let profileImageUrl = userInfo.photoURL;
    if (userInfo.displayName == null) {
      // No display name, take name from email
      const email = userInfo.email;
      name = email.substring(0, email.lastIndexOf('@'));
    }
    if (userInfo.photoURL == null) {
      profileImageUrl = '';
    }

    let profileImageUrlMapping = { raw: profileImageUrl };
    for (const sizeText of ALL_TEXT) {
      profileImageUrlMapping[sizeText] = '';
    }

    const newDonor = donorsCollection.doc(userInfo.uid);
    const timeNow = Date.now();
    const data = {
      userId: userInfo.uid,
      name: name,
      profileImageUrl: profileImageUrlMapping,
      numberOfReviews: 0,
      donor: true,
      isCorporatePartner: false,
      reviewRating: 0,
      hasAcceptedTermsOfService: true,
      isBlocked: false,
      isForcedRefreshRequired: false,
      joinedDateTime: timeNow,
      lastLoggedInDateTime: timeNow,
    };
    await newDonor.set(data);

    return newDonor.get();
  }

  async _updateDonorLoginTime(id) {
    const userDoc = donorsCollection.doc(id);

    const data = {
      lastLoggedInDateTime: Date.now(),
    };
    await userDoc.update(data);

    return userDoc.get();
  }

  async _doesDonorExist(id) {
    const snapshot = await donorsCollection.doc(id).get();
    return snapshot.exists;
  }

  async _createNPO(userProfile, name, contact, organizationName) {
    const organizationInfo = await this._getCategoryInfo(organizationName);

    let profileImageUrlMapping = { raw: '' };
    for (const sizeText of ALL_TEXT) {
      profileImageUrlMapping[sizeText] = '';
    }

    const userId = userProfile.uid;
    const newNPO = nposCollection.doc(userId);
    const timeNow = Date.now();
    const data = {
      userId: userId,
      name: name,
      contactNumber: contact,
      profileImageUrl: profileImageUrlMapping,
      npo: true,
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

    return newNPO.get();
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
    const [organizationInfo, uploadedImageUrl] = await Promise.all([
      this._getCategoryInfo(organizationName),
      this._uploadNPOProofImage(userProfile.uid, proofImage),
    ]);

    const dateOfRegistration = dayOfRegistration + '-' + monthOfRegistration + '-' + yearOfRegistration;

    const organization = {
      ...organizationInfo,
      registeredRegistrar: registeredRegistrar,
      registrationNumber: registrationNumber,
      dateOfRegistration: moment(dateOfRegistration, 'DD-MM-YYYY').valueOf(),
      proofImageUrl: uploadedImageUrl,
      proofImageVersion: 1,
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

    return newVerificationData.get();
  }

  async _doesNPOExist(id) {
    const snapshot = await nposCollection.doc(id).get();
    return snapshot.exists;
  }

  async _updateNPOLoginTime(id) {
    const userDoc = nposCollection.doc(id);

    const data = {
      lastLoggedInDateTime: Date.now(),
    };
    await userDoc.update(data);

    return userDoc.get();
  }

  async _uploadNPOProofImage(npoId, proofFile) {
    const ext = path.extname(proofFile.name);
    const storageRef = firebaseStorage.ref();
    const proofFileRef = storageRef.child(`npos/${npoId}/proofs/${npoId}_proof_v1${ext}`);
    await proofFileRef.put(proofFile);

    return proofFileRef.getDownloadURL();
  }

  async _getCategoryInfo(name) {
    const snapshot = await db.collection('npoOrganizations').where('name', '==', name).get();

    if (snapshot.empty) {
      return {};
    }

    return snapshot.docs[0].data();
  }

  async _createUser(id, type) {
    const newUser = usersCollection.doc(id);
    const data = {
      type: [type],
    };
    await newUser.set(data);

    return newUser.get();
  }

  async _validateDonor(userInfo) {
    if (userInfo == null) {
      throw new AuthError('unable-to-create-user', 'No user profile');
    }

    if (await this._doesDonorExist(userInfo.uid)) {
      throw new AuthError('unable-to-create-user', 'Donor account already exists');
    }

    if (await this._doesNPOExist(userInfo.uid)) {
      throw new AuthError('unable-to-create-user', 'User already sign up as a NPO');
    }
  }

  async _validateNPO(userInfo) {
    if (userInfo == null) {
      throw new AuthError('unable-to-create-user', 'No user profile');
    }

    if (await this._doesNPOExist(userInfo.uid)) {
      throw new AuthError('unable-to-create-user', 'NPO account already exists');
    }

    if (await this._doesDonorExist(userInfo.uid)) {
      throw new AuthError('unable-to-create-user', 'User already sign up as a Donor');
    }
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
    const imageExt = path.extname(proofImage.name).toLowerCase();

    if (!validExtensions.includes(imageExt)) {
      throw new AuthError('invalid-arguments', imageExt + ' is not a valid file ext');
    }
  }
}

export default AuthAPI;
