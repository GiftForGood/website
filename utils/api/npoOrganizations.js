import { db, firebaseAuth, firebase } from '../firebase';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { ORGANIZATION_ACTIONS } from '@constants/npoOrganization';
import { NPO_ORGANIZATION_EDIT_HISTORY_BATCH_SIZE } from './constants';
import NPOOrganizationsError from './error/npoOrganizationsError';
import { getExistingImageNames, uploadImage, deleteImages, isValidImageExtensions } from './common/images';

const npoOrganizationsCollection = db.collection('npoOrganizations');

class NPOOrganizationAPI {
  /**
   * Get all the NPO Organizations
   * @throws {FirebaseError}
   * @return {object} A firebase document of all the npo organizations
   */
  async getAll() {
    return npoOrganizationsCollection.orderBy('name', 'asc').get();
  }

  /**
   * Get a NPO organization info by it's id
   * @param {string} id The NPO organization id
   * @throws {FirebaseError}
   * @return {object} A firebase document of the NPO organization info
   */
  async getById(id) {
    return npoOrganizationsCollection.doc(id).get();
  }

  /**
   * Get a NPO organization info by it's name
   * @param {string} name The NPO organization name
   * @throws {FirebaseError}
   * @return {object} A firebase document of the NPO organization info
   */
  async getByName(name) {
    return npoOrganizationsCollection.where('name', '==', name).get();
  }

  /**
   * Get a batch of edit history belonging to a npo organization. Only return results of NPO_ORGANIZATION_EDIT_HISTORY_BATCH_SIZE
   * @param {string} id The organization id
   * @throws {NPOOrganizationError}
   * @throws {FirebaseError}
   * @return {object} A firebase document of all the edit history
   */
  async getEditHistory(id, lastQueriedDocument = null) {
    /* TODO: 
      Validate if user belongs to same org
      Get history
    */
    if (!(await this._doesNPOBelongToOrganization(id))) {
      throw new NPOOrganizationsError('invalid-user', 'user does not belong to organization');
    }

    const SORT_ORDER = 'desc';

    let query = npoOrganizationsCollection.doc(id).collection('actionsByUser');
    query = query.orderBy('appliedDateTime', SORT_ORDER);
    if (lastQueriedDocument !== null) {
      query = query.startAfter(lastQueriedDocument);
    }

    const snapshot = await query.limit(NPO_ORGANIZATION_EDIT_HISTORY_BATCH_SIZE).get();
    return snapshot.docs;
  }

  /**
   * Update an organization info
   * @param {string} id The organization id
   * @param {string} description The organization description
   * @param {string/object} coverImage The organization cover image
   *  string: Existing image
   *  file object: New image
   * @param {string/object} profileImage The organization profile image
   *  string: Existing image
   *  file object: New image
   * @throws {NPOOrganizationError}
   * @throws {FirebaseError}
   * @return {object} A firebase document of the update npo organization info
   */
  async update(id, description, coverImage, profileImage) {
    const user = firebaseAuth.currentUser;
    if (user === null) {
      throw new NPOOrganizationsError('invalid-user', 'current user is null');
    }

    this._validateImage(coverImage, 'cover');
    this._validateImage(profileImage, 'profile');
    if (!(await this._doesNPOBelongToOrganization(id))) {
      throw new NPOOrganizationsError('invalid-user', 'user does not belong to organization');
    }

    const [actions, coverImageUrl, profileImageUrl] = await Promise.all([
      this._getActions(id, description, coverImage, profileImage),
      this._updateImage(id, coverImage, 'cover'),
      this._updateImage(id, profileImage, 'profile'),
    ]);

    const orgInfo = {
      description,
    };
    if (typeof coverImage !== 'string') {
      orgInfo['coverImageUrl'] = { raw: coverImageUrl };
    }
    if (typeof profileImage !== 'string') {
      orgInfo['profileImageUrl'] = { raw: profileImageUrl };
    }

    const orgRef = npoOrganizationsCollection.doc(id);
    await orgRef.update(orgInfo);

    const actionPromises = actions.map(async (action) => {
      const actionInfo = {
        type: action,
        appliedDateTime: firebase.firestore.FieldValue.serverTimestamp(),
        email: user.email,
      };
      await orgRef.collection('actionsByUser').add(actionInfo);
    });

    await Promise.all(actionPromises);
    return orgRef.get();
  }

  async _doesNPOBelongToOrganization(orgId) {
    const user = firebaseAuth.currentUser;
    if (user === null) {
      return false;
    }

    const userId = user.uid;
    const npoSnapshot = await db.collection('npos').doc(userId).get();
    if (!npoSnapshot.exists) {
      return false;
    }

    const npoOrgId = npoSnapshot.data().organization.id;
    return npoOrgId === orgId;
  }

  async _getActions(id, description, coverImage, profileImage) {
    const actions = [];

    const snapshot = await this.getById(id);
    const orgInfo = snapshot.data();

    const hasUpdatedDescription = orgInfo.description !== description;
    if (hasUpdatedDescription) {
      actions.push(ORGANIZATION_ACTIONS.UPDATE_DESC);
    }
    // String is treated as an not changing an image
    if (typeof coverImage !== 'string') {
      actions.push(ORGANIZATION_ACTIONS.UPDATE_COVER_IMAGE);
    }
    if (typeof profileImage !== 'string') {
      actions.push(ORGANIZATION_ACTIONS.UPDATE_PROFILE_IMAGE);
    }

    return actions;
  }

  async _updateImage(orgId, image, imageType) {
    if (typeof image === 'string') {
      // String is treated as an not changing an image
      return image;
    }

    const PATH_PREFIX = `/npoOrganizations/${orgId}/`;

    const existingImageNames = await getExistingImageNames(PATH_PREFIX);
    const existingImageTypeNames = existingImageNames.filter((existingImageName) =>
      existingImageName.includes(imageType)
    );
    const hasExistingImages = existingImageTypeNames.length > 0;
    if (hasExistingImages) {
      deleteImages(existingImageTypeNames, PATH_PREFIX);
    }

    const ext = path.extname(image.name);
    const imageName = `${imageType}_${Date.now()}_${uuidv4()}${ext}`;
    return uploadImage(image, imageName, PATH_PREFIX);
  }

  _validateImage(image, imageType) {
    if (image == null) {
      throw new NPOOrganizationsError('invalid-image', 'provided image is null');
    }

    if (typeof image !== 'string' && !isValidImageExtensions([image])) {
      throw new NPOOrganizationsError('invalid-image-extension', `invalid ${imageType} image extension`);
    }
  }
}

export default NPOOrganizationAPI;
