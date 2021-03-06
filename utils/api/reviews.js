import { db, firebase } from '../firebase';
import { REVIEWS_BATCH_SIZE } from './constants';
import { wishes, donations } from '@constants/postType';
import ReviewError from './error/reviewError';

const reviewsCollection = db.collection('reviews');

class ReviewsAPI {
  /**
   * Gets a batch of reviews for either an NPO or donor, sorted by dateTime. Only return results of REVIEWS_BATCH_SIZE
   * @param {string} userId The user id for either the NPO or donor
   * @param {object} lastQueriedDocument The last queried firebase document to start the query after. If the field is not given, the query will start from the first document
   * @throws {FirebaseError}
   * @return {array} A list of firebase document of the reviews belonging to a user.
   */
  async get(userId, lastQueriedDocument = null) {
    if (lastQueriedDocument == null) {
      // First page
      return reviewsCollection
        .where('reviewFor.userId', '==', userId)
        .orderBy('dateTime', 'desc')
        .limit(REVIEWS_BATCH_SIZE)
        .get();
    } else {
      // Subsequent pages
      return reviewsCollection
        .where('reviewFor.userId', '==', userId)
        .orderBy('dateTime', 'desc')
        .startAfter(lastQueriedDocument)
        .limit(REVIEWS_BATCH_SIZE)
        .get();
    }
  }

  /**
   *
   * @param {string} wishId The wish id that is being reviewed
   * @param {string} npoId The NPO id that owns the wish
   * @param {string} donorId The donor id that fulfilled the wish
   * @param {number} rating The rating given by the NPO to the donor
   * @param {string} review The review given by the NPO to the donor
   * @throws {ReviewError}
   * @throws {FirebaseError}
   * @return {object} A firebase document of the reviewed wish
   */
  async createWishReview(wishId, npoId, donorId, rating, review) {
    this._validateRating(rating);

    const [npoInfo, donorInfo, wishInfo] = await Promise.all([
      this._getUserInfo('npos', npoId),
      this._getUserInfo('donors', donorId),
      this._getWishInfo(wishId),
    ]);

    if (wishInfo.status !== 'completed') {
      throw new ReviewError('invalid-wish-status', 'only can review a completed wish');
    }

    const post = {
      postId: wishId,
      postType: wishes,
    };

    const reviewBy = {
      userId: donorId,
      name: donorInfo.name,
      imageUrl: donorInfo.profileImageUrl,
    };

    const reviewFor = {
      userId: npoId,
      name: npoInfo.name,
      imageUrl: npoInfo.profileImageUrl,
    };

    let newReview = reviewsCollection.doc();
    const data = {
      rating: rating,
      description: review,
      post: post,
      reviewBy: reviewBy,
      reviewFor: reviewFor,
      dateTime: firebase.firestore.FieldValue.serverTimestamp(),
    };
    await newReview.set(data);

    return newReview.get();
  }

  /**
   *
   * @param {string} donationId The donation id that is being reviewed
   * @param {string} donorId The donor id that owns the donation
   * @param {string} npoId The npo id that is requested for the donation
   * @param {number} rating The rating given by the donor to the NPO
   * @param {string} review The review given by the donor to the NPO
   * @throws {ReviewError}
   * @throws {FirebaseError}
   * @return {object} A firebase document of the reviewed donation
   */
  async createDonationReview(donationId, donorId, npoId, rating, review) {
    this._validateRating(rating);

    const [npoInfo, donorInfo, donationInfo] = await Promise.all([
      this._getUserInfo('npos', npoId),
      this._getUserInfo('donors', donorId),
      this._getDonationInfo(donationId),
    ]);

    if (donationInfo.status !== 'completed') {
      throw new ReviewError('invalid-donation-status', 'only can review a completed donation');
    }

    const post = {
      postId: donationId,
      postType: donations,
    };

    const reviewBy = {
      userId: npoId,
      name: npoInfo.name,
      imageUrl: npoInfo.profileImageUrl,
    };

    const reviewFor = {
      userId: donorId,
      name: donorInfo.name,
      imageUrl: donorInfo.profileImageUrl,
    };

    let newReview = reviewsCollection.doc();
    const data = {
      rating: rating,
      description: review,
      post: post,
      reviewBy: reviewBy,
      reviewFor: reviewFor,
      dateTime: firebase.firestore.FieldValue.serverTimestamp(),
    };
    await newReview.set(data);

    return newReview.get();
  }

  async _getUserInfo(collectionName, id) {
    const snapshot = await db.collection(collectionName).doc(id).get();

    if (!snapshot.exists) {
      throw new ReviewError('invalid-user-id', 'user does not exist');
    }

    return snapshot.data();
  }

  async _getWishInfo(id) {
    const snapshot = await db.collection('wishes').doc(id).get();

    if (!snapshot.exists) {
      throw new ReviewError('invalid-wish-id', 'wish does not exist');
    }

    return snapshot.data();
  }

  async _getDonationInfo(id) {
    const snapshot = await db.collection('donations').doc(id).get();

    if (!snapshot.exists) {
      throw new ReviewError('invalid-donation-id', 'donation does not exist');
    }

    return snapshot.data();
  }

  _validateRating(rating) {
    if (rating < 1 || rating > 5) {
      throw new ReviewError('invalid-rating', 'rating only can be between 1 to 5');
    }
  }
}

export default ReviewsAPI;
