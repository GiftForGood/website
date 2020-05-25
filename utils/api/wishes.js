import { db, firebaseAuth } from '../firebase';
import * as Constants from './constants';
import * as WishesSortTypeConstant from '../constants/wishesSortType';
const moment = require('moment');

const wishesCollection = db.collection('wishes');

class WishesAPI {
  /**
   * Create a new wish
   * @param {string} title The wish title
   * @param {string} description The wish description
   * @param {array} categories A list of categories that the wish belongs to
   * @throws {FirebaseError}
   * @return {boolean} true if the wish is created, false otherwise
   */
  async create(title, description, categories) {
    let categoriesInfo = [];
    let userInfo = {};
    let organizationInfo = {};

    // Used a for loop instead of a forEach because forEach is not promise aware
    for (let i = 0; i < categories.length; i++) {
      let categoryInfo = await this._getCategoryInfoByName(categories[i]);

      if (Object.entries(categoryInfo).length !== 0) {
        categoriesInfo.push(categoryInfo);
      }
    }

    let allUserInfo = await this._getCurrentUserInfo();

    if (Object.entries(allUserInfo).length === 0) {
      return false;
    }
    userInfo.userId = allUserInfo.userId;
    userInfo.userName = allUserInfo.name;
    userInfo.profileImageUrl = allUserInfo.profileImageUrl;
    organizationInfo = allUserInfo.organization;

    let newWish = wishesCollection.doc();
    let timeNow = Date.now();
    const expiryDateTime = moment(timeNow).add(1, 'month').valueOf();
    let data = {
      wishesId: newWish.id,
      title: title,
      description: description,
      categories: categoriesInfo,
      status: 'pending',
      user: userInfo,
      organization: organizationInfo,
      postedDateTime: timeNow,
      updatedDateTime: timeNow,
      lastActionByUserDateTime: timeNow,
      expireDateTime: expiryDateTime,
      isBumped: false,
    };
    newWish.set(data);

    return true;
  }

  /**
   * Search wishes containing the text both in the title and description
   * @param {string} text
   * @return {object} A firebase document of wishes that contain the text
   */
  async search(text) {}

  /**
   * Get the top X pending wishes belonging to a category, sorted by timestamp
   * @param {object} categoryId The category id
   * @param {number} n The number of wishes to return
   * @throws {FirebaseError}
   * @return {object} A firebase document of the top n pending wishes
   */
  async getTopNPendingWishes(categoryId, n) {
    const categoryInfo = await this._getCategoryInfoById(categoryId);
    return wishesCollection
      .where('categories', 'array-contains', categoryInfo)
      .where('status', '==', 'pending')
      .orderBy('lastActionByUserDateTime', 'desc')
      .limit(n)
      .get();
  }

  /**
   * Get a batch of pending wishes. Only return results of WISHES_BATCH_SIZE
   * @param {string} orderBy The way to order the wishes. Only wishesSortTypeAllowed
   * @param {boolean} isReverse Indicates if the query should be ordered in reverse
   * @param {object} lastQueriedDocument The last queried firebase document to start the query after. If the field is not given, the query will start from the first document
   * @throws {ReferenceError}
   * @throws {FirebaseError}
   * @return {object} A firebase document of ordered pending wishes
   */
  async getPendingWishes(orderBy = WishesSortTypeConstant.TIMESTAMP, isReverse = false, lastQueriedDocument = null) {
    let sortOrder = 'asc';
    if (isReverse) {
      sortOrder = 'desc';
    }

    const orderByField = this._getOrderByField(orderBy);
    if (orderByField === '') {
      throw ReferenceError('Invalid orderBy type specified');
    }

    if (lastQueriedDocument == null) {
      // First page
      return wishesCollection
        .where('status', '==', 'pending')
        .orderBy(orderByField, sortOrder)
        .limit(Constants.WISHES_BATCH_SIZE)
        .get();
    } else {
      // Subsequent pages
      return wishesCollection
        .where('status', '==', 'pending')
        .orderBy(orderByField, sortOrder)
        .startAfter(lastQueriedDocument)
        .limit(Constants.WISHES_BATCH_SIZE)
        .get();
    }
  }

  /**
   * Get the initial batch of pending wishes belonging to a category. Only return results of WISHES_BATCH_SIZE
   * @param {object} categoryId The category id
   * @param {string} orderBy The way to order the wishes. Only wishesSortTypeAllowed
   * @param {boolean} isReverse Indicates if the query should be ordered in reverse
   * @param {object} lastQueriedDocument The last queried firebase document to start the query after. If the field is not given, the query will start from the first document
   * @throws {ReferenceError}
   * @throws {FirebaseError}
   * @return {object} A firebase document of ordered pending wishes belonging to a category
   */
  async getPendingWishesForCategory(
    categoryId,
    orderBy = WishesSortTypeConstant.TIMESTAMP,
    isReverse = false,
    lastQueriedDocument = null
  ) {
    // TODO: Sort by distance not implemented

    let sortOrder = 'asc';
    if (isReverse) {
      sortOrder = 'desc';
    }

    const categoryInfo = await this._getCategoryInfoById(categoryId);

    const orderByField = this._getOrderByField(orderBy);
    if (orderByField === '') {
      throw ReferenceError('Invalid orderBy type specified');
    }

    if (lastQueriedDocument == null) {
      // First page
      return wishesCollection
        .where('categories', 'array-contains', categoryInfo)
        .where('status', '==', 'pending')
        .orderBy(orderByField, sortOrder)
        .limit(Constants.WISHES_BATCH_SIZE)
        .get();
    } else {
      // Subsequent pages
      return wishesCollection
        .where('categories', 'array-contains', categoryInfo)
        .where('status', '==', 'pending')
        .orderBy(orderByField, sortOrder)
        .startAfter(lastQueriedDocument)
        .limit(Constants.WISHES_BATCH_SIZE)
        .get();
    }
  }

  /**
   * Get a wish by its id
   * @param {string} id The wish id
   * @throws {FirebaseError}
   * @return {object} A firebase document of the wish info
   */
  async getWish(id) {
    return wishesCollection.where('wishesId', '==', id).get();
  }

  /**
   * Get the initial batch of wishes belonging to a NPO. Only return results of WISHES_BATCH_SIZE
   * @param {string} npoId
   * @param {object} lastQueriedDocument The last queried firebase document to start the query after. If the field is not given, the query will start from the first document
   * @throws {FirebaseError}
   * @return {object} A firebase document of wishes belonging to a NPO
   */
  async getNPOWishes(npoId, lastQueriedDocument = null) {
    if (lastQueriedDocument == null) {
      // First page
      return wishesCollection
        .where('user.userId', '==', npoId)
        .orderBy('postedDateTime', 'desc')
        .limit(Constants.WISHES_BATCH_SIZE)
        .get();
    } else {
      // Subsequent pages
      return wishesCollection
        .where('user.userId', '==', npoId)
        .orderBy('postedDateTime', 'desc')
        .startAfter(lastQueriedDocument)
        .limit(Constants.WISHES_BATCH_SIZE)
        .get();
    }
  }

  /**
   * Get the initial batch of wishes belonging to a NPO filter by its status. Only return results of WISHES_BATCH_SIZE
   * @param {string} npoId
   * @param {string} status The status of the wishes
   * @param {object} lastQueriedDocument The last queried firebase document to start the query after. If the field is not given, the query will start from the first document
   * @throws {FirebaseError}
   * @return {object} A firebase document of wishes belonging to a NPO, filtered by status
   */
  async getNPOWishesFilterByStatus(npoId, status, lastQueriedDocument = null) {
    if (lastQueriedDocument == null) {
      // First page
      return wishesCollection
        .where('user.userId', '==', npoId)
        .where('status', '==', status.toLowerCase())
        .orderBy('postedDateTime', 'desc')
        .limit(Constants.WISHES_BATCH_SIZE)
        .get();
    } else {
      // Subsequent pages
      return wishesCollection
        .where('user.userId', '==', npoId)
        .where('status', '==', status.toLowerCase())
        .orderBy('postedDateTime', 'desc')
        .startAfter(lastQueriedDocument)
        .limit(Constants.WISHES_BATCH_SIZE)
        .get();
    }
  }

  /**
   * Get the initial batch of wishes that are completed by a donor. Only return results of WISHES_BATCH_SIZE
   * @param {string} donorId
   * @param {object} lastQueriedDocument The last queried firebase document to start the query after. If the field is not given, the query will start from the first document
   * @return {object} AA firebase document of wishes that a completed by a donor
   */
  async getDonorCompletedWishes(donorId, lastQueriedDocument = null) {
    if (lastQueriedDocument == null) {
      // First page
      return wishesCollection
        .where('status', '==', 'completed')
        .where('completed.donorUserId', '==', donorId)
        .orderBy('postedDateTime', 'desc')
        .limit(Constants.WISHES_BATCH_SIZE)
        .get();
    } else {
      // Subsequent pages
      return wishesCollection
        .where('status', '==', 'completed')
        .where('completed.donorUserId', '==', donorId)
        .orderBy('postedDateTime', 'desc')
        .startAfter(lastQueriedDocument)
        .limit(Constants.WISHES_BATCH_SIZE)
        .get();
    }
  }

  /**
   * Update the fields of a wish. Does not include updating of status
   * @param {string} id The wish id
   * @param {string} title The wish title
   * @param {string} description The wish description
   * @param {array} categories A list of categories that the wish belongs to
   * @return {boolean} true if the wish field/s is updated, false otherwise
   */
  async updateWish(id, title, description, categories) {
    const wishInfo = await this._getWishInfo(id);
    if (Object.entries(wishInfo).length === 0) {
      return false;
    }

    if (wishInfo.status !== 'pending') {
      return false;
    }

    const categoriesInfo = await this._getWishCategoriesInfo(wishInfo.categories, categories);

    let data = {
      title: title,
      description: description,
      categories: categoriesInfo,
      updatedDateTime: Date.now(),
    };

    wishesCollection.doc(id).update(data);

    return true;
  }

  /**
   * Bump a wish
   * @param {string} id The wish id
   * @throws {FirebaseError}
   * @return {boolean} true if the wish is bumped successfully, false otherwise
   */
  async bumpWish(id) {
    const wishInfo = await this._getWishInfo(id);
    if (Object.entries(wishInfo).length === 0) {
      return false;
    }

    if (wishInfo.status !== 'pending') {
      return false;
    }

    const updateTime = Date.now();
    const newExpiryDateTime = moment(wishInfo.expiryDateTime).add(1, 'week').valueOf();
    let wishUpdateInfo = {
      expireDateTime: newExpiryDateTime,
      lastActionByUserDateTime: updateTime,
      updatedDateTime: updateTime,
      isBumped: true,
    };
    let bumpInfo = {
      dateTime: updateTime,
    };

    const wishRef = wishesCollection.doc(id);
    wishRef.update(wishUpdateInfo);
    wishRef.collection('bump').add(bumpInfo);

    return true;
  }

  /**
   * Close a wish
   * @param {string} id The wish id
   * @param {string} reason The reason for closing
   * @throws {FirebaseError}
   * @return {boolean} true if the wish is closed successfully, false otherwise
   */
  async closeWish(id, reason) {
    const wishInfo = await this._getWishInfo(id);
    if (Object.entries(wishInfo).length === 0) {
      return false;
    }

    if (wishInfo.status !== 'pending') {
      return false;
    }

    const updateTime = Date.now();
    const data = {
      updatedDateTime: updateTime,
      status: 'closed',
      closed: {
        reason: reason,
        dateTime: updateTime,
      },
    };
    wishesCollection.doc(id).update(data);

    return true;
  }

  /**
   * Complete a wish
   * @param {string} id The wish id
   * @param {string} donorId The donor id that completed the wish
   * @throws {FirebaseError}
   * @return {boolean} true if the wish is completed successfully, false otherwise
   */
  async completeWish(id, donorId) {
    const wishInfo = await this._getWishInfo(id);
    const donorInfo = await this._getUserInfo(donorId);
    if (Object.entries(wishInfo).length === 0 || Object.entries(donorInfo).length === 0) {
      return false;
    }

    if (wishInfo.status !== 'pending') {
      return false;
    }

    const updateTime = Date.now();
    const data = {
      updatedDateTime: updateTime,
      status: 'completed',
      completed: {
        donorUserId: donorInfo.userId,
        donorName: donorInfo.name,
        donorProfileImageUrl: donorInfo.profileImageUrl,
        dateTime: updateTime,
      },
    };
    wishesCollection.doc(id).update(data);

    return true;
  }

  async _getWishInfo(id) {
    let snapshot = await wishesCollection.where('wishesId', '==', id).get();

    // Assumes that categories id are unique
    if (snapshot.empty) {
      return {};
    }

    return snapshot.docs[0].data();
  }

  async _getCategoryInfoById(id) {
    let snapshot = await db.collection('categories').where('id', '==', id).get();

    // Assumes that categories name are unique
    if (snapshot.empty) {
      return {};
    }

    return snapshot.docs[0].data();
  }

  async _getCategoryInfoByName(name) {
    let snapshot = await db.collection('categories').where('name', '==', name).get();

    // Assumes that categories name are unique
    if (snapshot.empty) {
      return {};
    }

    return snapshot.docs[0].data();
  }

  async _getCurrentUserInfo() {
    const user = firebaseAuth.currentUser;

    if (user == null) {
      return {};
    }

    const userId = user.uid;
    return this._getUserInfo(userId);
  }

  async _getUserInfo(id) {
    let snapshot = await db.collection('users').where('userId', '==', id).get();

    // Assumes that userId are unique
    if (snapshot.empty) {
      return {};
    }

    return snapshot.docs[0].data();
  }

  async _getWishCategoriesInfo(existingCategories, updatedCategoriesName) {
    let categoriesInfo = [];

    for (const name of updatedCategoriesName) {
      let categoryInfo = existingCategories.find((category) => category.name === name);

      if (typeof categoryInfo === 'undefined') {
        categoryInfo = await this._getCategoryInfoByName(name);
      }

      categoriesInfo.push(categoryInfo);
    }

    return categoriesInfo;
  }

  _getOrderByField(orderByType) {
    switch (orderByType) {
      case WishesSortTypeConstant.TIMESTAMP:
        return 'lastActionByUserDateTime';
      case WishesSortTypeConstant.NPO_NAME:
        return 'user.userName';
      default:
        return '';
    }
  }
}

export default WishesAPI;
