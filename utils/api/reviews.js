import { db } from '../firebase';

const reviewsCollection = db.collection('reviews');

class ReviewsAPI {
  /**
   *
   * @param {string} wishId The wish id that is being reviewed
   * @param {string} npoId The NPO id that owns the wish
   * @param {string} donorId The donor id that fulfilled the wish
   * @param {number} rating The rating given by the NPO to the donor
   * @param {string} review The review given by the NPO to the donor
   * @throws {FirebaseError}
   * @return {boolean} true if the review is created, false otherwise
   */
  async createWishReview(wishId, npoId, donorId, rating, review) {
    const npoInfo = await this._getUserInfo('npos', npoId);
    const donorInfo = await this._getUserInfo('donors', donorId);
    const wishInfo = await this._getWishInfo(wishId);

    const npoDoesNotExist = Object.entries(npoInfo).length === 0;
    const donorDoesNotExist = Object.entries(donorInfo).length === 0;
    const wishDoesNotExist = Object.entries(wishInfo).length === 0;

    if (npoDoesNotExist || donorDoesNotExist || wishDoesNotExist) {
      return false;
    }

    if (wishInfo.status !== 'pending') {
      return false;
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
    newReview.set(data);

    return true;
  }

  /**
   *
   * @param {string} donationId The donation id that is being reviewed
   * @param {string} donorId The donor id that owns the donation
   * @param {string} npoId The npo id that is requested for the donation
   * @param {number} rating The rating given by the donor to the NPO
   * @param {string} review The review given by the donor to the NPO
   * @return {boolean} true if the review is created, false otherwise
   */
  async createDonationReview(donationId, donorId, npoId, rating, review) {
    const npoInfo = await this._getUserInfo('npos', npoId);
    const donorInfo = await this._getUserInfo('donors', donorId);
    const donationInfo = await this._getDonationInfo(donationId);

    const npoDoesNotExist = Object.entries(npoInfo).length === 0;
    const donorDoesNotExist = Object.entries(donorInfo).length === 0;
    const donationDoesNotExist = Object.entries(donationInfo).length === 0;

    if (npoDoesNotExist || donorDoesNotExist || donationDoesNotExist) {
      return false;
    }

    if (donationInfo.status !== 'pending') {
      return false;
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
    newReview.set(data);

    return true;
  }

  async _getUserInfo(collectionName, id) {
    let snapshot = await db.collection(collectionName).where('userId', '==', id).get();

    // Assumes that userId are unique
    if (snapshot.empty) {
      return {};
    }

    return snapshot.docs[0].data();
  }

  async _getWishInfo(id) {
    let snapshot = await db.collection('wishes').where('wishId', '==', id).get();

    // Assumes that wishId are unique
    if (snapshot.empty) {
      return {};
    }

    return snapshot.docs[0].data();
  }

  async _getDonationInfo(id) {
    let snapshot = await db.collection('donations').where('donationId', '==', id).get();

    // Assumes that donationId are unique
    if (snapshot.empty) {
      return {};
    }

    return snapshot.docs[0].data();
  }
}

export default ReviewsAPI;
