import { db, firebaseAuth } from '../firebase';
import { WISHES_BATCH_SIZE } from './constants';
import { TIMESTAMP, NPO_NAME } from '../constants/wishesSortType';
import WishError from './error/wishError';
const moment = require('moment');

const wishesCollection = db.collection('wishes');

class WishesAPI {
  /**
   * Create a new wish
   * @param {string} title The wish title text
   * @param {string} description The wish description text
   * @param {array} categories A list of categories id that the wish belongs to
   * @throws {WishError}
   * @throws {FirebaseError}
   * @return {object} A firebase document of the created wish
   */
  async create(title, description, categories) {
    let userInfo = {};
    let organizationInfo = {};

    const categoriesInfoPromise = this._getAllCategoriesInfo(categories);
    const allUserInfoPromise = this._getCurrentUserInfo();
    const [categoriesInfo, allUserInfo] = await Promise.all([categoriesInfoPromise, allUserInfoPromise]);

    if (typeof allUserInfo === 'undefined') {
      throw new WishError('invalid-current-user');
    }
    userInfo.userId = allUserInfo.userId;
    userInfo.userName = allUserInfo.name;
    userInfo.profileImageUrl = allUserInfo.profileImageUrl;
    organizationInfo = allUserInfo.organization;

    let newWish = wishesCollection.doc();
    const timeNow = Date.now();
    const expiryDateTime = moment(timeNow).add(1, 'month').valueOf();
    let data = {
      wishId: newWish.id,
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
    await newWish.set(data);

    return newWish.get();
  }

  /**
   * Search wishes containing the text both in the title and description
   * @param {string} text
   * @return {object} A firebase document of wishes that contain the text
   */
  async search(text) {}

  /**
   * Get the top X pending wishes belonging to a category, sorted by timestamp
   * @param {string} categoryId The category id
   * @param {number} n The number of wishes to query
   * @throws {FirebaseError}
   * @return {array} A list of firebase document of the top n pending wishes
   */
  async getTopNPendingWishesForCategory(categoryId, n) {
    const categoryInfo = await this._getCategoryInfo(categoryId);
    return wishesCollection
      .where('categories', 'array-contains', categoryInfo)
      .where('status', '==', 'pending')
      .orderBy('lastActionByUserDateTime', 'desc')
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
    // TODO: Sort by distance not implemented
    this._validateOrderBy(orderBy);

    let sortOrder = 'asc';
    if (isReverse) {
      sortOrder = 'desc';
    }

    if (lastQueriedDocument == null) {
      // First page
      return wishesCollection
        .where('status', '==', 'pending')
        .orderBy(orderBy, sortOrder)
        .limit(WISHES_BATCH_SIZE)
        .get();
    } else {
      // Subsequent pages
      return wishesCollection
        .where('status', '==', 'pending')
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
    // TODO: Sort by distance not implemented
    this._validateOrderBy(orderBy);

    let sortOrder = 'asc';
    if (isReverse) {
      sortOrder = 'desc';
    }

    const categoryInfo = await this._getCategoryInfo(categoryId);

    if (lastQueriedDocument == null) {
      // First page
      return wishesCollection
        .where('categories', 'array-contains', categoryInfo)
        .where('status', '==', 'pending')
        .orderBy(orderBy, sortOrder)
        .limit(WISHES_BATCH_SIZE)
        .get();
    } else {
      // Subsequent pages
      return wishesCollection
        .where('categories', 'array-contains', categoryInfo)
        .where('status', '==', 'pending')
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
  async getWish(id) {
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
        .orderBy('postedDateTime', 'desc')
        .limit(WISHES_BATCH_SIZE)
        .get();
    } else {
      // Subsequent pages
      return wishesCollection
        .where('user.userId', '==', npoId)
        .orderBy('postedDateTime', 'desc')
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
        .orderBy('postedDateTime', 'desc')
        .limit(WISHES_BATCH_SIZE)
        .get();
    } else {
      // Subsequent pages
      return wishesCollection
        .where('user.userId', '==', npoId)
        .where('status', '==', status.toLowerCase())
        .orderBy('postedDateTime', 'desc')
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
        .where('status', '==', 'completed')
        .where('completed.donorUserId', '==', donorId)
        .orderBy('postedDateTime', 'desc')
        .limit(WISHES_BATCH_SIZE)
        .get();
    } else {
      // Subsequent pages
      return wishesCollection
        .where('status', '==', 'completed')
        .where('completed.donorUserId', '==', donorId)
        .orderBy('postedDateTime', 'desc')
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
   * @throws {WishError}
   * @throws {FirebaseError}
   * @return {object} A firebase document of the updated wish
   */
  async updateWish(id, title, description, categories) {
    const wishInfo = await this._getWishInfo(id);
    if (typeof wishInfo === 'undefined') {
      throw new WishError('invalid-wish-id', 'wish does not exist');
    }

    if (wishInfo.status !== 'pending') {
      throw new WishError('invalid-wish-status', 'only can update a pending wish');
    }

    const categoriesInfo = await this._getWishCategoriesInfo(wishInfo.categories, categories);

    const data = {
      title: title,
      description: description,
      categories: categoriesInfo,
      updatedDateTime: Date.now(),
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
  async bumpWish(id) {
    const wishInfo = await this._getWishInfo(id);
    if (typeof wishInfo === 'undefined') {
      throw new WishError('invalid-wish-id', 'wish does not exist');
    }

    if (wishInfo.status !== 'pending') {
      throw new WishError('invalid-wish-status', 'only can update a pending wish');
    }

    const updateTime = Date.now();
    const newExpiryDateTime = moment(wishInfo.expireDateTime).add(1, 'week').valueOf();
    const wishUpdateInfo = {
      expireDateTime: newExpiryDateTime,
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
  async closeWish(id, reason) {
    const wishInfo = await this._getWishInfo(id);
    if (typeof wishInfo === 'undefined') {
      throw new WishError('invalid-wish-id', 'wish does not exist');
    }

    if (wishInfo.status !== 'pending') {
      throw new WishError('invalid-wish-status', 'only can update a pending wish');
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
  async completeWish(id, donorId) {
    const [wishInfo, donorInfo] = await Promise.all([this._getWishInfo(id), this._getDonorInfo(donorId)]);
    if (typeof wishInfo === 'undefined') {
      throw new WishError('invalid-wish-id', 'wish does not exist');
    }
    if (typeof donorInfo === 'undefined') {
      throw new WishError('invalid-donor-id', 'donor does not exist');
    }

    if (wishInfo.status !== 'pending') {
      throw new WishError('invalid-wish-status', 'only can update a pending wish');
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

    let wishDoc = wishesCollection.doc(id);
    await wishDoc.update(data);

    return wishDoc.get();
  }

  async _getCurrentUserInfo() {
    const user = firebaseAuth.currentUser;

    if (user == null) {
      return {};
    }

    const userId = user.uid;
    return this._getNPOInfo(userId);
  }

  async _getNPOInfo(id) {
    const snapshot = await db.collection('npos').doc(id).get();
    return snapshot.data();
  }

  async _getDonorInfo(id) {
    const snapshot = await db.collection('donors').doc(id).get();
    return snapshot.data();
  }

  async _getWishInfo(id) {
    const snapshot = await wishesCollection.doc(id).get();
    return snapshot.data();
  }

  async _getCategoryInfo(id) {
    const snapshot = await db.collection('categories').doc(id).get();
    return snapshot.data();
  }

  async _getAllCategoriesInfo(categoriesId) {
    const categoriesPromise = categoriesId.map((categoryId) => {
      return this._getCategoryInfo(categoryId);
    });

    const categoriesInfo = await Promise.all(categoriesPromise);
    return categoriesInfo.filter((categoryInfo) => typeof categoryInfo !== 'undefined');
  }

  async _getWishCategoriesInfo(existingCategories, updatedCategoriesId) {
    let categoriesInfo = [];
    let newCategoriesIdToQuery = [];

    for (const id of updatedCategoriesId) {
      let categoryInfo = existingCategories.find((category) => category.id === id);

      if (typeof categoryInfo === 'undefined') {
        newCategoriesIdToQuery.push(id);
      } else {
        categoriesInfo.push(categoryInfo);
      }
    }

    const newCategoriesPromise = newCategoriesIdToQuery.map((categoryId) => {
      return this._getCategoryInfo(categoryId);
    });
    const newCategoriesInfo = await Promise.all(newCategoriesPromise);

    return [...categoriesInfo, ...newCategoriesInfo];
  }

  _validateOrderBy(orderByType) {
    const validOrderBys = [TIMESTAMP, NPO_NAME];

    if (!validOrderBys.includes(orderByType)) {
      throw new WishError('invalid-orderBy', `${orderByType} is not a valid orderby`);
    }
  }
}

export default WishesAPI;
