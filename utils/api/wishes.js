import { db, firebaseAuth, firebase } from '../firebase';
import { WISHES_BATCH_SIZE } from './constants';
import { TIMESTAMP, NPO_NAME, POSTED_TIMESTAMP } from '../constants/wishesSortType';
import { PENDING, CLOSED, COMPLETED } from '../constants/postStatus';
import { getLocations, getUpdatedLocations } from './common/location';
import {
  getCategoryInfo,
  getAllCategoryInfos,
  getUpdatedCategoryInfos,
  getCustomPostCategoryInfo,
  getCustomPostCategoryInfos,
} from './common/categories';
import WishError from './error/wishError';
const moment = require('moment');

const wishesCollection = db.collection('wishes');

class WishesAPI {
  /**
   * Create a new wish
   * @param {string} title The wish title text
   * @param {string} description The wish description text
   * @param {array} categories A list of categories id that the wish belongs to
   * @param {array} locations A list of locations text that the wish belongs to
   * @throws {WishError}
   * @throws {FirebaseError}
   * @return {object} A firebase document of the created wish
   */
  async create(title, description, categories, locations) {
    let userInfo = {};
    let organizationInfo = {};

    const [allCategoryInfos, locationInfos, allUserInfo] = await Promise.all([
      getAllCategoryInfos(categories),
      getLocations(locations),
      this._getCurrentUserInfo(),
    ]);

    const categoryInfos = getCustomPostCategoryInfos(allCategoryInfos);

    userInfo.userId = allUserInfo.userId;
    userInfo.userName = allUserInfo.name;
    userInfo.profileImageUrl = allUserInfo.profileImageUrl;
    organizationInfo = allUserInfo.organization;

    let newWish = wishesCollection.doc();
    const timeNow = firebase.firestore.FieldValue.serverTimestamp();
    const expiryDateTime = moment(timeNow).add(1, 'month').toDate();
    const firestoreExpiryDateTime = firebase.firestore.Timestamp.fromDate(expiryDateTime);
    const data = {
      wishId: newWish.id,
      title: title,
      description: description,
      categories: categoryInfos,
      locations: locationInfos,
      status: PENDING,
      user: userInfo,
      organization: organizationInfo,
      postedDateTime: timeNow,
      updatedDateTime: timeNow,
      lastActionByUserDateTime: timeNow,
      expireDateTime: firestoreExpiryDateTime,
      isBumped: false,
    };
    await newWish.set(data);

    return newWish.get();
  }

  /**
   * Get the top X pending wishes belonging to a category, sorted by timestamp
   * @param {string} categoryId The category id
   * @param {number} n The number of wishes to query
   * @throws {FirebaseError}
   * @return {array} A list of firebase document of the top n pending wishes
   */
  async getTopNPendingWishesForCategory(categoryId, n) {
    const allCategoryInfo = await getCategoryInfo(categoryId);
    const categoryInfo = getCustomPostCategoryInfo(allCategoryInfo);
    return wishesCollection
      .where('categories', 'array-contains', categoryInfo)
      .where('status', '==', PENDING)
      .orderBy(TIMESTAMP, 'desc')
      .limit(n)
      .get();
  }

  /**
   * Gets a batch of pending wishes. Only return results of WISHES_BATCH_SIZE
   * @param {string} orderBy The way to order the wishes. Look at wishesSortType.js to know what are the various ways.
   * @param {boolean} isReverse Indicates if the query should be ordered in reverse
   * @param {object} lastQueriedDocument The last queried firebase document to start the query after. If the field is not given, the query will start from the first document
   * @throws {WishError}
   * @throws {FirebaseError}
   * @returns {array} A list of firebase document of all ordered pending wishes
   */

  async getPendingWishes(orderBy = TIMESTAMP, isReverse = false, lastQueriedDocument = null) {
    this._validateOrderBy(orderBy);

    let sortOrder = 'asc';
    if (isReverse) {
      sortOrder = 'desc';
    }

    if (lastQueriedDocument == null) {
      // First page
      return wishesCollection.where('status', '==', PENDING).orderBy(orderBy, sortOrder).limit(WISHES_BATCH_SIZE).get();
    } else {
      // Subsequent pages
      return wishesCollection
        .where('status', '==', PENDING)
        .orderBy(orderBy, sortOrder)
        .startAfter(lastQueriedDocument)
        .limit(WISHES_BATCH_SIZE)
        .get();
    }
  }

  /**
   * Get a batch of pending wishes belonging to a category. Only return results of WISHES_BATCH_SIZE
   * @param {string} categoryId The category id
   * @param {string} orderBy The way to order the wishes. Look at wishesSortType.js to know what are the various ways.
   * @param {boolean} isReverse Indicates if the query should be ordered in reverse
   * @param {object} lastQueriedDocument The last queried firebase document to start the query after. If the field is not given, the query will start from the first document
   * @throws {WishError}
   * @throws {FirebaseError}
   * @return {array} A list of firebase document of ordered pending wishes belonging to a category
   */
  async getPendingWishesForCategory(categoryId, orderBy = TIMESTAMP, isReverse = false, lastQueriedDocument = null) {
    this._validateOrderBy(orderBy);

    let sortOrder = 'asc';
    if (isReverse) {
      sortOrder = 'desc';
    }

    const allCategoryInfo = await getCategoryInfo(categoryId);
    const categoryInfo = getCustomPostCategoryInfo(allCategoryInfo);

    if (lastQueriedDocument == null) {
      // First page
      return wishesCollection
        .where('categories', 'array-contains', categoryInfo)
        .where('status', '==', PENDING)
        .orderBy(orderBy, sortOrder)
        .limit(WISHES_BATCH_SIZE)
        .get();
    } else {
      // Subsequent pages
      return wishesCollection
        .where('categories', 'array-contains', categoryInfo)
        .where('status', '==', PENDING)
        .orderBy(orderBy, sortOrder)
        .startAfter(lastQueriedDocument)
        .limit(WISHES_BATCH_SIZE)
        .get();
    }
  }

  /**
   * Get a wish by its id
   * @param {string} id The wish id
   * @throws {FirebaseError}
   * @return {object} A firebase document of the wish info
   */
  async get(id) {
    return wishesCollection.doc(id).get();
  }

  /**
   * Get a batch of wishes belonging to a NPO. Only return results of WISHES_BATCH_SIZE
   * @param {string} npoId
   * @param {object} lastQueriedDocument The last queried firebase document to start the query after. If the field is not given, the query will start from the first document
   * @throws {FirebaseError}
   * @return {array} A list of firebase document of wishes belonging to a NPO
   */
  async getNPOWishes(npoId, lastQueriedDocument = null) {
    if (lastQueriedDocument == null) {
      // First page
      return wishesCollection
        .where('user.userId', '==', npoId)
        .orderBy(TIMESTAMP, 'desc')
        .limit(WISHES_BATCH_SIZE)
        .get();
    } else {
      // Subsequent pages
      return wishesCollection
        .where('user.userId', '==', npoId)
        .orderBy(TIMESTAMP, 'desc')
        .startAfter(lastQueriedDocument)
        .limit(WISHES_BATCH_SIZE)
        .get();
    }
  }

  /**
   * Get the initial batch of wishes belonging to a NPO filter by its status. Only return results of WISHES_BATCH_SIZE
   * @param {string} npoId
   * @param {string} status The status of the wishes to query
   * @param {object} lastQueriedDocument The last queried firebase document to start the query after. If the field is not given, the query will start from the first document
   * @throws {FirebaseError}
   * @return {array} A list of firebase document of wishes belonging to a NPO, filtered by status
   */
  async getNPOWishesFilterByStatus(npoId, status, lastQueriedDocument = null) {
    if (lastQueriedDocument == null) {
      // First page
      return wishesCollection
        .where('user.userId', '==', npoId)
        .where('status', '==', status.toLowerCase())
        .orderBy(TIMESTAMP, 'desc')
        .limit(WISHES_BATCH_SIZE)
        .get();
    } else {
      // Subsequent pages
      return wishesCollection
        .where('user.userId', '==', npoId)
        .where('status', '==', status.toLowerCase())
        .orderBy(TIMESTAMP, 'desc')
        .startAfter(lastQueriedDocument)
        .limit(WISHES_BATCH_SIZE)
        .get();
    }
  }

  /**
   * Get a batch of wishes that are completed by a donor. Only return results of WISHES_BATCH_SIZE
   * @param {string} donorId
   * @param {object} lastQueriedDocument The last queried firebase document to start the query after. If the field is not given, the query will start from the first document
   * @throws {FirebaseError}
   * @return {object} AA firebase document of wishes that a completed by a donor
   */
  async getDonorCompletedWishes(donorId, lastQueriedDocument = null) {
    if (lastQueriedDocument == null) {
      // First page
      return wishesCollection
        .where('status', '==', COMPLETED)
        .where('completed.donorUserId', '==', donorId)
        .orderBy(POSTED_TIMESTAMP, 'desc')
        .limit(WISHES_BATCH_SIZE)
        .get();
    } else {
      // Subsequent pages
      return wishesCollection
        .where('status', '==', COMPLETED)
        .where('completed.donorUserId', '==', donorId)
        .orderBy(POSTED_TIMESTAMP, 'desc')
        .startAfter(lastQueriedDocument)
        .limit(WISHES_BATCH_SIZE)
        .get();
    }
  }

  /**
   * Update the fields of a wish. Does not include updating of status
   * @param {string} id The wish id
   * @param {string} title The wish title text
   * @param {string} description The wish description text
   * @param {array} categories A list of categories id that the wish belongs to
   * @param {array} locations A list of locations text that the wish belongs to
   * @throws {WishError}
   * @throws {FirebaseError}
   * @return {object} A firebase document of the updated wish
   */
  async update(id, title, description, categories, locations) {
    const wishInfo = await this._getWishInfo(id);
    if (wishInfo.status !== PENDING) {
      throw new WishError('invalid-wish-status', 'only can update a pending wish');
    }

    const [allCategoryInfos, locationInfos] = await Promise.all([
      getUpdatedCategoryInfos(wishInfo.categories, categories),
      getUpdatedLocations(wishInfo.locations, locations),
    ]);

    const categoryInfos = getCustomPostCategoryInfos(allCategoryInfos);

    const data = {
      title: title,
      description: description,
      categories: categoryInfos,
      locations: locationInfos,
      updatedDateTime: firebase.firestore.FieldValue.serverTimestamp(),
    };

    let wishDoc = wishesCollection.doc(id);
    await wishDoc.update(data);

    return wishDoc.get();
  }

  /**
   * Bump a wish
   * @param {string} id The wish id
   * @throws {WishError}
   * @throws {FirebaseError}
   * @return {object} A firebase document of the bumped wish
   */
  async bump(id) {
    const wishInfo = await this._getWishInfo(id);
    if (wishInfo.status !== PENDING) {
      throw new WishError('invalid-wish-status', 'only can update a pending wish');
    }

    const updateTime = firebase.firestore.FieldValue.serverTimestamp();
    const newExpiryDateTime = moment(wishInfo.expireDateTime).add(1, 'week').toDate();
    const firestoreNewExpiryDateTime = firebase.firestore.Timestamp.fromDate(newExpiryDateTime);
    const wishUpdateInfo = {
      expireDateTime: firestoreNewExpiryDateTime,
      lastActionByUserDateTime: updateTime,
      updatedDateTime: updateTime,
      isBumped: true,
    };
    const bumpInfo = {
      dateTime: updateTime,
    };

    let wishDoc = wishesCollection.doc(id);
    await wishDoc.update(wishUpdateInfo);
    wishDoc.collection('bumps').add(bumpInfo);

    return wishDoc.get();
  }

  /**
   * Close a wish
   * @param {string} id The wish id
   * @param {string} reason The reason text for closing
   * @throws {WishError}
   * @throws {FirebaseError}
   * @return {object} A firebase document of the closed wish
   */
  async close(id, reason) {
    const wishInfo = await this._getWishInfo(id);
    if (wishInfo.status !== PENDING) {
      throw new WishError('invalid-wish-status', 'only can update a pending wish');
    }

    const updateTime = firebase.firestore.FieldValue.serverTimestamp();
    const data = {
      updatedDateTime: updateTime,
      status: CLOSED,
      closed: {
        reason: reason,
        dateTime: updateTime,
      },
    };

    let wishDoc = wishesCollection.doc(id);
    await wishDoc.update(data);

    return wishDoc.get();
  }

  /**
   * Complete a wish
   * @param {string} id The wish id
   * @param {string} donorId The donor id that completed the wish
   * @throws {WishError}
   * @throws {FirebaseError}
   * @return {object} A firebase document of the completed wish
   */
  async complete(id, donorId) {
    const [wishInfo, donorInfo] = await Promise.all([this._getWishInfo(id), this._getDonorInfo(donorId)]);
    if (wishInfo.status !== PENDING) {
      throw new WishError('invalid-wish-status', 'only can update a pending wish');
    }

    const updateTime = firebase.firestore.FieldValue.serverTimestamp();
    const data = {
      updatedDateTime: updateTime,
      status: COMPLETED,
      completed: {
        donorUserId: donorInfo.userId,
        donorName: donorInfo.name,
        donorProfileImageUrl: donorInfo.profileImageUrl,
        dateTime: updateTime,
      },
    };

    let wishDoc = wishesCollection.doc(id);
    await wishDoc.update(data);

    return wishDoc.get();
  }

  async _getCurrentUserInfo() {
    const user = firebaseAuth.currentUser;

    if (user == null) {
      throw new WishError('invalid-current-user');
    }

    const userId = user.uid;
    return this._getNPOInfo(userId);
  }

  async _getNPOInfo(id) {
    const snapshot = await db.collection('npos').doc(id).get();

    if (!snapshot.exists) {
      throw new WishError('invalid-npo-id', 'npo does not exist');
    }

    return snapshot.data();
  }

  async _getDonorInfo(id) {
    const snapshot = await db.collection('donors').doc(id).get();

    if (!snapshot.exists) {
      throw new WishError('invalid-donor-id', 'donor does not exist');
    }

    return snapshot.data();
  }

  async _getWishInfo(id) {
    const snapshot = await wishesCollection.doc(id).get();

    if (!snapshot.exists) {
      throw new WishError('invalid-wish-id', 'wish does not exist');
    }

    return snapshot.data();
  }

  _validateOrderBy(orderByType) {
    const validOrderBys = [TIMESTAMP, NPO_NAME];

    if (!validOrderBys.includes(orderByType)) {
      throw new WishError('invalid-orderBy', `${orderByType} is not a valid orderby`);
    }
  }
}

export default WishesAPI;
