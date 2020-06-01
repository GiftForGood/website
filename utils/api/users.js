import { db, firebaseAuth, firebaseStorage } from '../firebase';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import UserError from './error/userError';

class UsersAPI {
  /**
   * Get a user type by its id
   * @param {string} id The user id to search by
   * @return {object} A firebase document of the user type info
   */
  async getUserType(id) {
    return db.collection('users').doc(id).get();
  }

  /**
   * Get a NPO info by its id
   * @param {string} id The NPO id to search by
   * @return {object} A firebase document of the NPO info
   */
  async getNPO(id) {
    return db.collection('npos').doc(id).get();
  }

  /**
   * Update fields of current logged in NPO
   * @param {string} name The name of the NPO
   * @param {number} contact The contact of the NPO
   * @param {object} profileImage The profile image of the NPO. When the parameter is specified, it means there is an change in the profile picture.
   * @throws {UserError}
   * @throws {FirebaseError}
   * @return {object} A firebase document of the updated NPO info
   */
  async updateNPO(name, contact, profileImage = null) {
    // Important: This function will trigger the cloud function to update all the relevant collection's documents that contain the NPO info
    const userId = await this._getCurrentUserId();
    let data = {
      name: name,
      contactNumber: contact,
    };

    if (profileImage != null) {
      // Updating profile pic
      this._validateImageExtension(profileImage);

      const profileImageUrl = await this._uploadProfileImage('npos', userId, profileImage);
      data['profileImageUrl'] = profileImageUrl;
    }

    let npoDoc = db.collection('npos').doc(userId);
    await npoDoc.update(data);

    return npoDoc.get();
  }

  /**
   * Update the verification proof of the current logged in NPO
   * @param {object} proofFile The image of the proof. Only `.pdf` is allowed.
   * @throws {UserError}
   * @throws {FirebaseError}
   * @return {object} A firebase document of the updated NPO verification info.
   */
  async updateNPOVerificationProof(proofFile) {
    this._validateProofFileExtension(proofFile);

    const userId = await this._getCurrentUserId();

    let npoVerificationDoc = db.collection('npoVerifications').doc(userId);
    const npoVerificationSnapshot = await npoVerificationDoc.get();
    const npoVerificationInfo = npoVerificationSnapshot.data();
    if (typeof npoVerificationInfo === 'undefined') {
      throw new UserError('invalid-current-user', 'no logged in user');
    }

    const currentProofVersion = npoVerificationInfo.organization.proofImageVersion;
    const nextVersion = parseInt(currentProofVersion + 1);
    const nextVersionString = `v${nextVersion}`;

    const proofFileUrl = await this._uploadNPOProofFile(userId, proofFile, nextVersionString);

    const data = {
      ['organization.proofImageUrl']: proofFileUrl,
      ['organization.proofImageVersion']: nextVersion,
    };

    await npoVerificationDoc.update(data);

    return npoVerificationDoc.get();
  }

  /**
   * Get a donor info by its id
   * @param {string} id The NPO id to search by
   * @return {object} A firebase document of the NPO info
   */
  async getDonor(id) {
    return db.collection('donors').doc(id).get();
  }

  /**
   * Update fields of current logged in donor
   * @param {string} name The name of the NPO
   * @param {object} profileImage The profile image of the NPO. When the parameter is specified, it means there is an change in the profile picture.
   * @throws {UserError}
   * @throws {FirebaseError}
   * @return {object} A firebase document of the updated donor info
   */
  async updateDonor(name, profileImage = null) {
    // Important: This function will trigger the cloud function to update all the relevant collection's documents that contain the donor info
    const userId = await this._getCurrentUserId();
    let data = {
      name: name,
    };

    if (profileImage != null) {
      // Updating profile pic
      this._validateImageExtension(profileImage);

      const profileImageUrl = await this._uploadProfileImage('donors', userId, profileImage);
      data['profileImageUrl'] = profileImageUrl;
    }

    let donorDoc = db.collection('donors').doc(userId);
    await donorDoc.update(data);

    return donorDoc.get();
  }

  async _getCurrentUserId() {
    const user = firebaseAuth.currentUser;

    if (user == null) {
      throw new UserError('invalid-current-user', 'no logged in user');
    }

    return user.uid;
  }

  /**
   * Upload a npo/user profile image to firebase storage
   * @param {string} userType The user folder name to upload to
   * @param {*} userId The user id which the image belong to
   * @param {*} image
   */
  async _uploadProfileImage(userType, userId, profileImage) {
    const ext = path.extname(profileImage.name);
    const imageName = `${userId}_${Date.now()}_${uuidv4()}${ext}`;

    const storageRef = firebaseStorage.ref();
    const imageRef = storageRef.child(`${userType}/${userId}/profiles/${imageName}`);
    await imageRef.put(profileImage);

    return imageRef.getDownloadURL();
  }

  async _uploadNPOProofFile(npoId, proofFile, version) {
    const ext = path.extname(proofFile.name);
    const storageRef = firebaseStorage.ref();
    const proofFileRef = storageRef.child(`npos/${npoId}/proofs/${npoId}_proof_${version}${ext}`);

    await proofFileRef.put(proofFile);

    return proofFileRef.getDownloadURL();
  }

  _validateImageExtension(image) {
    const validExtensions = ['.jpg', '.jpeg', '.png'];

    if (image == null) {
      throw new UserError('invalid-image', 'provided image is null');
    }

    const imageExt = path.extname(image.name).toLowerCase();
    if (!validExtensions.includes(imageExt)) {
      throw new UserError('invalid-image-extension', `Only ${validExtensions.join(', ')} are valid image extensions`);
    }
  }

  _validateProofFileExtension(proofFile) {
    const validExtensions = ['.pdf'];
    const fileExt = path.extname(proofFile.name);

    if (!validExtensions.includes(fileExt)) {
      throw new UserError(
        'invalid-proof-file-extension',
        `Only ${validExtensions.join(', ')} are valid proof file extensions`
      );
    }
  }
}

export default UsersAPI;
