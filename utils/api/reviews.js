import { db } from '../firebase';
import ReviewError from './error/reviewError';

const reviewsCollection = db.collection('reviews');

class ReviewsAPI {
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
    const npoInfo = await this._getUserInfo('npos', npoId);
    const donorInfo = await this._getUserInfo('donors', donorId);
    const wishInfo = await this._getWishInfo(wishId);

    if (typeof npoInfo === 'undefined') {
      throw new ReviewError('invalid-npo-id', 'npo does not exist');
    }
    if (typeof donorInfo === 'undefined') {
      throw new ReviewError('invalid-donor-id', 'donor does not exist');
    }
    if (typeof wishInfo === 'undefined') {
      throw new ReviewError('invalid-wish-id', 'wish does not exist');
    }

    if (wishInfo.status !== 'completed') {
      throw new ReviewError('invalid-wish-status', 'only can review a completed wish');
    }

    const post = {
      postId: wishId,
      postType: 'wishes',
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
      dateTime: Date.now(),
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
    const npoInfo = await this._getUserInfo('npos', npoId);
    const donorInfo = await this._getUserInfo('donors', donorId);
    const donationInfo = await this._getDonationInfo(donationId);

    if (typeof npoInfo === 'undefined') {
      throw new ReviewError('invalid-npo-id', 'npo does not exist');
    }
    if (typeof donorInfo === 'undefined') {
      throw new ReviewError('invalid-donor-id', 'donor does not exist');
    }
    if (typeof donationInfo === 'undefined') {
      throw new ReviewError('invalid-donation-id', 'donation does not exist');
    }

    if (donationInfo.status !== 'completed') {
      throw new ReviewError('invalid-donation-status', 'only can review a completed donation');
    }

    const post = {
      postId: donationId,
      postType: 'donations',
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
      dateTime: Date.now(),
    };
    await newReview.set(data);

    return newReview.get();
  }

  async _getUserInfo(collectionName, id) {
    let snapshot = await db.collection(collectionName).doc(id).get();
    return snapshot.data();
  }

  async _getWishInfo(id) {
    let snapshot = await db.collection('wishes').doc(id).get();
    return snapshot.data();
  }

  async _getDonationInfo(id) {
    let snapshot = await db.collection('donations').doc(id).get();
    return snapshot.data();
  }
}

export default ReviewsAPI;
