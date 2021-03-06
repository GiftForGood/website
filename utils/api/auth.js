import { db, firebaseAuth, firebaseStorage, firebase } from '../firebase';
import * as path from 'path';
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
   * @param {string} registrationNumber The registration number
   * @param {string} activities The description of the type of activities that the NPO does
   * @throws {AuthError}
   * @return {array} [token, userProfile, npoDoc]
   *  token: JWT
   *  userProfile: The user profile
   *  npoDoc: Firebase document that contains the userInfo in the db
   */
  async registerNPO(name, contact, email, password, organization, registrationNumber, activities) {
    await firebaseAuth.createUserWithEmailAndPassword(email, password);
    const token = await firebaseAuth.currentUser.getIdToken();
    const userProfile = firebaseAuth.currentUser;

    await this._validateNPO(userProfile);
    const organizationInfo = await this._getOrganizationInfo(organization);
    const [npoDoc, userDoc] = await Promise.all([
      this._createNPO(userProfile, name, contact, organizationInfo),
      this._createUser(userProfile.uid, NPO),
    ]);
    // These functions needs to be after `createNPO` as it needs the npo data to be there
    await Promise.all([
      this._updateNPOOrganizationMemberStatus(organizationInfo),
      this._createNPOVerificationData(userProfile, name, contact, organizationInfo, registrationNumber, activities),
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

    let donorDoc;
    if (!(await this._doesUserExist(DONOR, userProfile.uid))) {
      // Create the donor account if doesn't exist
      if (await this._doesUserExist(NPO, userProfile.uid)) {
        throw new AuthError('unable-to-create-user', 'User already signed up as a NPO');
      }

      const [newDonorDoc, userDoc] = await Promise.all([
        this._createDonor(userProfile),
        this._createUser(userProfile.uid, DONOR),
      ]);
      donorDoc = newDonorDoc;
    } else {
      donorDoc = await this._updateUserLoginTime(DONOR, userProfile.uid);
    }

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
    if (!(await this._doesUserExist(DONOR, userProfile.uid))) {
      this.logout();
      throw new AuthError('invalid-user', 'donor account does not exist');
    }
    const donorDoc = await this._updateUserLoginTime(DONOR, userProfile.uid);

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
    if (!(await this._doesUserExist(NPO, userProfile.uid))) {
      this.logout();
      throw new AuthError('invalid-user', 'npo account does not exist');
    }
    const userDoc = await this._updateUserLoginTime(NPO, userProfile.uid);

    return [token, userProfile, userDoc];
  }

  /**
   * Send a verification email to the currently logged in user
   * @throws {FirebaseError}
   */
  async sendVerificationEmail() {
    const user = firebaseAuth.currentUser;

    const url = `${FIREBASE_EMAIL_ACTION_URL}?verificationUserId=${user.uid}`;
    const actionCodeSettings = {
      url: url,
    };

    return user.sendEmailVerification(actionCodeSettings);
  }

  /**
   * Logout a user (donor & NPO)
   */
  async logout() {
    firebaseAuth.signOut();
  }

  /**
   * Sends a password reset email to the user
   * @param {string} email The email of the user(NPO | Donor)
   */
  async sendPasswordResetEmail(email) {
    let url = FIREBASE_EMAIL_ACTION_URL + '/login';
    const actionCodeSettings = {
      url: url,
    };
    return firebaseAuth.sendPasswordResetEmail(email, actionCodeSettings);
  }

  /**
   * Verify the password reset code sent by firebase
   * @param {string} oobCode The oobCode sent by firebase and a one-time code, used to identify and verify a request
   */
  async verifyPasswordResetCode(oobCode) {
    return firebaseAuth.verifyPasswordResetCode(oobCode);
  }

  /**
   * Reset the user's password
   * @param {string} oobCode The oobCode sent by firebase and a one-time code, used to identify and verify a request
   * @param {string} newPassword The new password for the user's
   */
  async resetPassword(oobCode, newPassword) {
    return firebaseAuth.confirmPasswordReset(oobCode, newPassword);
  }

  /**
   * Verify the verification code sent by firebase
   * @param {string} oobCode The oobCode sent by firebase and a one-time code, used to identify and verify a request
   */
  async verifyEmailVerificationCode(oobCode) {
    return firebaseAuth.applyActionCode(oobCode);
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
    const timeNow = firebase.firestore.FieldValue.serverTimestamp();
    const data = {
      userId: userInfo.uid,
      isEmailVerified: userInfo.emailVerified,
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
      email: userInfo.email,
      notifications: {
        allowSendChatEmail: true,
      },
      unreadChatNotificationsCount: 0,
      unreadNotificationsCount: 0,
    };
    await newDonor.set(data);

    return newDonor.get();
  }

  async _createNPO(userProfile, name, contact, organizationInfo) {
    let profileImageUrlMapping = { raw: '' };
    for (const sizeText of ALL_TEXT) {
      profileImageUrlMapping[sizeText] = '';
    }

    const userId = userProfile.uid;
    const newNPO = nposCollection.doc(userId);
    const timeNow = firebase.firestore.FieldValue.serverTimestamp();
    const data = {
      userId: userId,
      isEmailVerified: userProfile.emailVerified,
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
      email: userProfile.email,
      notifications: {
        allowSendChatEmail: true,
      },
      unreadChatNotificationsCount: 0,
      unreadNotificationsCount: 0,
    };
    await newNPO.set(data);

    return newNPO.get();
  }

  async _createNPOVerificationData(userProfile, name, contact, organizationInfo, registrationNumber, activities) {
    const timeNow = firebase.firestore.FieldValue.serverTimestamp();

    const organization = {
      ...organizationInfo,
      registrationNumber: registrationNumber,
      activities: activities,
    };
    const newVerificationData = db.collection('npoVerifications').doc(userProfile.uid);
    const data = {
      userId: userProfile.uid,
      email: userProfile.email,
      name: name,
      contactNumber: contact,
      organization: organization,
      status: 'pending',
      admin: {
        id: '',
        name: '',
      },
      isVerifiedByAdmin: false,
      appliedDateTime: timeNow,
      lastUpdatedDateTime: timeNow,
    };
    await newVerificationData.set(data);

    return newVerificationData.get();
  }

  async _updateNPOOrganizationMemberStatus(organizationInfo) {
    const data = {
      isMember: true,
    };

    const npoOrgDoc = db.collection('npoOrganizations').doc(organizationInfo.id);
    await npoOrgDoc.update(data);

    return npoOrgDoc.get();
  }

  async _getOrganizationInfo(name) {
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

  async _doesUserExist(type, id) {
    const snapshot = await db.collection(`${type}s`).doc(id).get();
    return snapshot.exists;
  }

  async _updateUserLoginTime(type, id) {
    const userDoc = db.collection(`${type}s`).doc(id);

    const data = {
      lastLoggedInDateTime: firebase.firestore.FieldValue.serverTimestamp(),
    };
    await userDoc.update(data);

    return userDoc.get();
  }

  async _validateDonor(userInfo) {
    if (userInfo == null) {
      throw new AuthError('unable-to-create-user', 'No user profile');
    }

    if (await this._doesUserExist(DONOR, userInfo.uid)) {
      throw new AuthError('unable-to-create-user', 'Donor account already exists');
    }

    if (await this._doesUserExist(NPO, userInfo.uid)) {
      throw new AuthError('unable-to-create-user', 'User already signed up as a NPO');
    }
  }

  async _validateNPO(userInfo) {
    if (userInfo == null) {
      throw new AuthError('unable-to-create-user', 'No user profile');
    }

    if (await this._doesUserExist(NPO, userInfo.uid)) {
      throw new AuthError('unable-to-create-user', 'NPO account already exists');
    }

    if (await this._doesUserExist(DONOR, userInfo.uid)) {
      throw new AuthError('unable-to-create-user', 'User already signed up as a Donor');
    }
  }
}

export default AuthAPI;
