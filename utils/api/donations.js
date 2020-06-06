import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { db, firebaseAuth, firebaseStorage } from '../firebase';
import * as moment from 'moment';
import * as path from 'path';
import { DONATIONS_BATCH_SIZE } from './constants';
import { NEW, USED } from '../constants/itemCondition';
import { TIMESTAMP } from '../constants/donationsSortType';
import { PENDING, CLOSED, COMPLETED } from '../constants/postStatus';
import { getLocations, getUpdatedLocations } from './common/location';
import {
  getCategoryInfo,
  getAllCategoryInfos,
  getUpdatedCategoryInfos,
  getCustomPostCategoryInfo,
  getCustomPostCategoryInfos,
} from './common/categories';
import DonationError from './error/donationsError';

const donationsCollection = db.collection('donations');

class DonationsAPI {
  /**
   * Create a new donation
   * @param {string} title The donation title text
   * @param {string} description The donation description text
   * @param {array} categories A list of category id that the donation belongs to
   * @param {number} validPeriodFromDay The valid date that the donation is valid from (day)
   * @param {number} validPeriodFromMonth The valid date that the donation is valid from (month)
   * @param {number} validPeriodFromYear The valid date that the donation is valid from (year)
   * @param {number} validPeriodToDay The valid date that the donation is valid to (day)
   * @param {number} validPeriodToMonth The valid date that the donation is valid to (month)
   * @param {number} validPeriodToYear The valid date that the donation is valid to (year)
   * @param {string} dimensions The dimension text of the donated item
   * @param {array} locations A list of location text of the donation
   * @param {string} itemCondition The condition of the donated item
   * @param {object} coverImage The cover image file for the donation
   * @param {array} images A list of images file for the donations. Should include the cover image file
   * @throws {DonationError}
   * @throws {FirebaseError}
   * @return {object} The created donation firebase document
   */
  async create(
    title,
    description,
    categories,
    validPeriodFromDay,
    validPeriodFromMonth,
    validPeriodFromYear,
    validPeriodToDay,
    validPeriodToMonth,
    validPeriodToYear,
    dimensions,
    locations,
    itemCondition,
    coverImage,
    images
  ) {
    let userInfo = {};

    // Input validation
    this._validateDate(validPeriodFromDay, validPeriodFromMonth, validPeriodFromYear);
    this._validateDate(validPeriodToDay, validPeriodToMonth, validPeriodToYear);
    this._validateDateRange(
      validPeriodFromDay,
      validPeriodFromMonth,
      validPeriodFromYear,
      validPeriodToDay,
      validPeriodToMonth,
      validPeriodToYear
    );
    this._validateItemCondition(itemCondition);
    this._validateImageExtensions(images);
    this._validateCoverImageAndImages(coverImage, images);

    const validPeriodFromDate = `${validPeriodFromDay}-${validPeriodFromMonth}-${validPeriodFromYear}`;
    const validPeriodToDate = `${validPeriodToDay}-${validPeriodToMonth}-${validPeriodToYear}`;

    const [allCategoryInfos, allUserInfo] = await Promise.all([
      getAllCategoryInfos(categories),
      this._getCurrentUserInfo(),
    ]);

    const categoryInfos = getCustomPostCategoryInfos(allCategoryInfos);

    userInfo.userId = allUserInfo.userId;
    userInfo.userName = allUserInfo.name;
    userInfo.profileImageUrl = allUserInfo.profileImageUrl;

    let newDonation = donationsCollection.doc();
    const [[coverImageUrl, imageUrls], locationInfos] = await Promise.all([
      this._uploadImages(userInfo.userId, newDonation.id, images, coverImage),
      getLocations(locations),
    ]);

    const timeNow = Date.now();
    let data = {
      donationId: newDonation.id,
      title: title,
      description: description,
      status: PENDING,
      categories: categoryInfos,
      user: userInfo,
      imageUrls: imageUrls,
      coverImageUrl: coverImageUrl,
      validPeriodFrom: moment(validPeriodFromDate, 'DD-MM-YYYY').valueOf(),
      validPeriodTo: moment(validPeriodToDate, 'DD-MM-YYYY').valueOf(),
      dimensions: dimensions,
      locations: locationInfos,
      itemCondition: itemCondition,
      postedDateTime: timeNow,
      updatedDateTime: timeNow,
    };
    await newDonation.set(data);

    return newDonation.get();
  }

  /**
   * Search donations containing the text both in the title and description
   * @param {string} text The search text
   * @return {object} A firebase document of donations that contain the text
   */
  async search(text) {}

  /**
   * Get the top X pending donations belonging to a category, sorted by timestamp
   * @param {string} categoryId The category id
   * @param {number} n The number of donations to query
   * @throws {FirebaseError}
   * @returns {array} A list of firebase document of the top n pending donations
   */
  async getTopNPendingDonationsForCategory(categoryId, n) {
    const allCategoryInfo = await getCategoryInfo(categoryId);
    const categoryInfo = getCustomPostCategoryInfo(allCategoryInfo);
    return donationsCollection
      .where('categories', 'array-contains', categoryInfo)
      .where('status', '==', PENDING)
      .orderBy(TIMESTAMP, 'desc')
      .limit(n)
      .get();
  }

  /**
   * Gets a batch of pending donations. Only return results of DONATIONS_BATCH_SIZE
   * @param {string} orderBy The way to order the donations
   * @param {boolean} isReverse Indicates if the query should be ordered in reverse
   * @param {object} lastQueriedDocument The last queried firebase document to start the query after. If the field is not given, the query will start from the first document
   * @throws {DonationError}
   * @throws {FirebaseError}
   * @returns {array} A list of firebase document of all ordered pending donations
   */
  async getPendingDonations(orderBy = TIMESTAMP, isReverse = false, lastQueriedDocument = null) {
    // TODO: Sort by distance not implemented
    this._validateOrderBy(orderBy);

    let sortOrder = 'asc';
    if (isReverse) {
      sortOrder = 'desc';
    }

    if (lastQueriedDocument == null) {
      // First page
      return donationsCollection
        .where('status', '==', PENDING)
        .orderBy(orderBy, sortOrder)
        .limit(DONATIONS_BATCH_SIZE)
        .get();
    } else {
      // Subsequent pages
      return donationsCollection
        .where('status', '==', PENDING)
        .orderBy(orderBy, sortOrder)
        .startAfter(lastQueriedDocument)
        .limit(DONATIONS_BATCH_SIZE)
        .get();
    }
  }

  /**
   * Get a batch of pending donations belonging to a category. Only return results of DONATIONS_BATCH_SIZE
   * @param {string} categoryId The category id
   * @param {string} orderBy The way to order the donations
   * @param {boolean} isReverse Indicates if the query should be ordered in reverse
   * @param {object} lastQueriedDocument The last queried firebase document to start the query after. If the field is not given, the query will start from the first document
   * @throws {DonationError}
   * @throws {FirebaseError}
   * @return {array} A list of firebase document of ordered pending donations belonging to a category
   */
  async getPendingDonationsForCategory(categoryId, orderBy = TIMESTAMP, isReverse = false, lastQueriedDocument = null) {
    // TODO: Sort by distance not implemented
    this._validateOrderBy(orderBy);

    let sortOrder = 'asc';
    if (isReverse) {
      sortOrder = 'desc';
    }

    const allCategoryInfo = await getCategoryInfo(categoryId);
    const categoryInfo = getCustomPostCategoryInfo(allCategoryInfo);

    if (lastQueriedDocument == null) {
      // First page
      return donationsCollection
        .where('categories', 'array-contains', categoryInfo)
        .where('status', '==', PENDING)
        .orderBy(orderBy, sortOrder)
        .limit(DONATIONS_BATCH_SIZE)
        .get();
    } else {
      // Subsequent pages
      return donationsCollection
        .where('categories', 'array-contains', categoryInfo)
        .where('status', '==', PENDING)
        .orderBy(orderBy, sortOrder)
        .startAfter(lastQueriedDocument)
        .limit(DONATIONS_BATCH_SIZE)
        .get();
    }
  }

  /**
   * Get a donation by its id
   * @param {string} id
   * @return {object} A firebase document of the donation info
   */
  async get(id) {
    return donationsCollection.doc(id).get();
  }

  /**
   * Get a batch of donations belonging to a donor. Only return DONATIONS_BATCH_SIZE results
   * @param {string} donorId
   * @param {object} lastQueriedDocument The last queried firebase document to start the query after. If the field is not given, the query will start from the first document
   * @throws {FirebaseError}
   * @return {array} A list of firebase document of donations belonging to a donor
   */
  async getDonorDonations(donorId, lastQueriedDocument = null) {
    if (lastQueriedDocument == null) {
      // First page
      return donationsCollection
        .where('user.userId', '==', donorId)
        .orderBy(TIMESTAMP, 'desc')
        .limit(DONATIONS_BATCH_SIZE)
        .get();
    } else {
      // Subsequent pages
      return donationsCollection
        .where('user.userId', '==', donorId)
        .orderBy(TIMESTAMP, 'desc')
        .startAfter(lastQueriedDocument)
        .limit(DONATIONS_BATCH_SIZE)
        .get();
    }
  }

  /**
   * Get a batch of donations belonging to a donor filter by its status. Only return DONATIONS_BATCH_SIZE results
   * @param {string} donorId
   * @param {string} status The status of the donations to query
   * @param {object} lastQueriedDocument The last queried firebase document to start the query after. If the field is not given, the query will start from the first document
   * @throws {FirebaseError}
   * @return {array} A list of firebase document of donations belonging a donor, filtered by status
   */
  async getDonorDonationsFilterByStatus(donorId, status, lastQueriedDocument = null) {
    if (lastQueriedDocument == null) {
      // First page
      return donationsCollection
        .where('user.userId', '==', donorId)
        .where('status', '==', status.toLowerCase())
        .orderBy(TIMESTAMP, 'desc')
        .limit(DONATIONS_BATCH_SIZE)
        .get();
    } else {
      // Subsequent pages
      return donationsCollection
        .where('user.userId', '==', donorId)
        .where('status', '==', status.toLowerCase())
        .orderBy(TIMESTAMP, 'desc')
        .startAfter(lastQueriedDocument)
        .limit(DONATIONS_BATCH_SIZE)
        .get();
    }
  }

  /**
   * Update the fields of a donation. Does not include updating of status
   * @param {string} id The donation id
   * @param {string} title The donation title text
   * @param {string} description The donation description text
   * @param {array} categories A list of category ids that the donation belongs to
   * @param {number} validPeriodFromDay The valid date that the donation is valid from (day)
   * @param {number} validPeriodFromMonth The valid date that the donation is valid from (month)
   * @param {number} validPeriodFromYear The valid date that the donation is valid from (year)
   * @param {number} validPeriodToDay The valid date that the donation is valid to (day)
   * @param {number} validPeriodToMonth The valid date that the donation is valid to (month)
   * @param {number} validPeriodToYear The valid date that the donation is valid to (year)
   * @param {string} dimensions The dimension text of the donated item
   * @param {array} locations A list of location text of the donation
   * @param {string} itemCondition The condition of the donated item
   * @param {string/object} coverImage The cover image of the donation. Can either be a string or a file object
   *  string: Is an existing image
   *  file object: Is a new image
   * @param {array} images A list of images for the donation. Should include the cover image.
   *  It is represented as a list of string and file objects. Strings should always appear before the file object.
   *  string: Existing images
   *  file object: New images
   * @throws {DonationError}
   * @throws {FirebaseError}
   * @return {object} A firebase document of the updated donation
   */
  async update(
    id,
    title,
    description,
    categories,
    validPeriodFromDay,
    validPeriodFromMonth,
    validPeriodFromYear,
    validPeriodToDay,
    validPeriodToMonth,
    validPeriodToYear,
    dimensions,
    locations,
    itemCondition,
    coverImage,
    images
  ) {
    this._validateDate(validPeriodFromDay, validPeriodFromMonth, validPeriodFromYear);
    this._validateDate(validPeriodToDay, validPeriodToMonth, validPeriodToYear);
    this._validateDateRange(
      validPeriodFromDay,
      validPeriodFromMonth,
      validPeriodFromYear,
      validPeriodToDay,
      validPeriodToMonth,
      validPeriodToYear
    );
    this._validateItemCondition(itemCondition);
    this._validateUpdateImageExtensions(images);
    this._validateCoverImageAndUpdateImages(coverImage, images);

    const donationInfo = await this._getDonationInfo(id);
    if (donationInfo.status !== PENDING) {
      throw new DonationError('invalid-donation-status', 'only can update a pending donation');
    }

    const validPeriodFromDate = `${validPeriodFromDay}-${validPeriodFromMonth}-${validPeriodFromYear}`;
    const validPeriodToDate = `${validPeriodToDay}-${validPeriodToMonth}-${validPeriodToYear}`;

    const [allCategoryInfos, locationInfos, [coverImageUrl, imageUrls]] = await Promise.all([
      getUpdatedCategoryInfos(donationInfo.categories, categories),
      getUpdatedLocations(donationInfo.locations, locations),
      this._getDonationImages(donationInfo.user.userId, donationInfo.donationId, images, coverImage),
    ]);

    const categoryInfos = getCustomPostCategoryInfos(allCategoryInfos);

    const data = {
      title: title,
      description: description,
      categories: categoryInfos,
      imageUrls: imageUrls,
      coverImageUrl: coverImageUrl,
      validPeriodFrom: moment(validPeriodFromDate, 'DD-MM-YYYY').valueOf(),
      validPeriodTo: moment(validPeriodToDate, 'DD-MM-YYYY').valueOf(),
      dimensions: dimensions,
      locations: locationInfos,
      itemCondition: itemCondition,
      updatedDateTime: Date.now(),
    };

    let donationDoc = donationsCollection.doc(id);
    await donationDoc.update(data);

    return donationDoc.get();
  }

  /**
   * Close a donation
   * @param {string} id The donation id
   * @param {string} reason The reason text for closing
   * @throws {DonationError}
   * @throws {FirebaseError}
   * @return {object} A firebase document of the closed donation
   */
  async close(id, reason) {
    const donationInfo = await this._getDonationInfo(id);
    if (donationInfo.status !== PENDING) {
      throw new DonationError('invalid-donation-status', 'Only can close a pending donation');
    }

    const updateTime = Date.now();
    const data = {
      updatedDateTime: updateTime,
      status: CLOSED,
      closed: {
        reason: reason,
        dateTime: updateTime,
      },
    };

    let donationDoc = donationsCollection.doc(id);
    await donationDoc.update(data);

    return donationDoc.get();
  }

  /**
   * Complete a donation
   * @param {string} id The donation id
   * @param {string} npoId The NPO id that completed the donation
   * @throws {DonationError}
   * @throws {FirebaseError}
   * @return {object} A firebase document of the completed donation
   */
  async complete(id, npoId) {
    const [donationInfo, npoInfo] = await Promise.all([this._getDonationInfo(id), this._getNPOInfo(npoId)]);
    if (donationInfo.status !== PENDING) {
      throw new DonationError('invalid-donation-status', 'Only can complete a pending donation');
    }

    const organizationInfo = {
      name: npoInfo.organization.name,
      address: npoInfo.organization.address,
    };

    const updateTime = Date.now();
    const data = {
      updatedDateTime: updateTime,
      status: COMPLETED,
      completed: {
        npoUserId: npoInfo.userId,
        organization: organizationInfo,
        npoName: npoInfo.name,
        npoProfileImageUrl: npoInfo.profileImageUrl,
        dateTime: updateTime,
      },
    };

    let donationDoc = donationsCollection.doc(id);
    await donationDoc.update(data);

    return donationDoc.get();
  }

  async _getCurrentUserInfo() {
    const user = firebaseAuth.currentUser;

    if (user == null) {
      throw new DonationError('invalid-current-user');
    }

    const userId = user.uid;
    return this._getDonorInfo(userId);
  }

  async _getDonorInfo(id) {
    const snapshot = await db.collection('donors').doc(id).get();

    if (!snapshot.exists) {
      throw new DonationError('invalid-donor-id', 'donar does not exist');
    }

    return snapshot.data();
  }

  async _getDonationInfo(id) {
    const snapshot = await donationsCollection.doc(id).get();

    if (!snapshot.exists) {
      throw new DonationError('invalid-donation-id', 'donation does not exist');
    }

    return snapshot.data();
  }

  async _getNPOInfo(id) {
    const snapshot = await db.collection('npos').doc(id).get();

    if (!snapshot.exists) {
      throw new DonationError('invalid-npo-id', `npo does not exist`);
    }

    return snapshot.data();
  }

  async _uploadImages(userId, donationId, images, coverImage = null) {
    let imageInfos = [];

    for (const image of images) {
      const ext = path.extname(image.name);
      const isCoverImage = coverImage !== null && image.name == coverImage.name;
      const imageName = `${donationId}_${Date.now()}_${uuidv4()}${ext}`;
      const imageInfo = { [imageName]: image };

      if (isCoverImage) {
        // Ensure that cover image is the first item in the array
        imageInfos.unshift(imageInfo);
      } else {
        imageInfos.push(imageInfo);
      }
    }

    const imagesPromise = imageInfos.map((imageInfo) => {
      return this._uploadImage(userId, donationId, Object.values(imageInfo)[0], Object.keys(imageInfo)[0]);
    });

    const imageUrls = await Promise.all(imagesPromise);
    const coverImageUrl = coverImage !== null ? imageUrls[0] : '';

    return [coverImageUrl, imageUrls];
  }

  async _uploadImage(userId, donationId, image, imageName) {
    const storageRef = firebaseStorage.ref();
    const imageRef = storageRef.child(`donors/${userId}/donations/${donationId}/${imageName}`);
    await imageRef.put(image);

    return imageRef.getDownloadURL();
  }

  async _deleteImages(userId, donationId, imageNames) {
    for (const imageName of imageNames) {
      this._deleteImage(userId, donationId, imageName);
    }
  }

  async _deleteImage(userId, donationId, imageName) {
    const storageRef = firebaseStorage.ref();
    const imageRef = storageRef.child(`donors/${userId}/donations/${donationId}/${imageName}`);
    imageRef.delete();
  }

  async _getDonationImages(userId, donationId, updatedImages, coverImage) {
    let imageUrls = [];
    let newImageObjects = [];
    let existingImageIndexes = [];
    let imageNamesToDelete = [];

    const storageRef = firebaseStorage.ref();
    const imageRefs = storageRef.child(`donors/${userId}/donations/${donationId}/`);

    let existingImageInfos = [];
    const existingImageRefs = await imageRefs.listAll();
    const existingImageUrlPromises = existingImageRefs.items.map((imageRef) => {
      return imageRef.getDownloadURL();
    });
    const existingImageUrls = await Promise.all(existingImageUrlPromises);

    for (let i = 0; i < existingImageUrls.length; i++) {
      const imageInfo = { name: existingImageRefs.items[i].name, url: existingImageUrls[i] };
      existingImageInfos.push(imageInfo);
    }

    for (const image of updatedImages) {
      if (typeof image === 'string') {
        // Existing images
        const existingImageIndex = existingImageInfos.findIndex((existingImageInfo) => {
          return existingImageInfo.url == image;
        });

        if (typeof existingImageIndex === -1) {
          throw new DonationError('invalid-image-url', 'the image url should be an existing image url');
        }

        existingImageIndexes.push(existingImageIndex);
        imageUrls.push(existingImageInfos[existingImageIndex].url);
      } else {
        // New images
        newImageObjects.push(image);
      }
    }

    // Finding images to delete
    for (let i = 0; i < existingImageInfos.length; i++) {
      if (!existingImageIndexes.includes(i)) {
        imageNamesToDelete.push(existingImageInfos[i].name);
      }
    }

    this._deleteImages(userId, donationId, imageNamesToDelete);
    const [coverImageUrl, newImageUrls] = await this._uploadUpdatedImages(
      userId,
      donationId,
      newImageObjects,
      coverImage
    );

    return [coverImageUrl, [...imageUrls, ...newImageUrls]];
  }

  async _uploadUpdatedImages(userId, donationId, images, coverImage) {
    // This is helper function to handle the upload images of update donation
    let coverImageUrl = '';
    let coverImageToUpload = null;

    if (typeof coverImage !== 'string') {
      coverImageToUpload = coverImage;
    }

    const [uploadedCoverImageUrl, uploadedImageUrls] = await this._uploadImages(
      userId,
      donationId,
      images,
      coverImageToUpload
    );

    if (typeof coverImage === 'string') {
      coverImageUrl = coverImage;
    } else {
      coverImageUrl = uploadedCoverImageUrl;
    }

    return [coverImageUrl, uploadedImageUrls];
  }

  _validateOrderBy(orderByType) {
    const validOrderBys = [TIMESTAMP];

    if (!validOrderBys.includes(orderByType)) {
      throw new DonationError('invalid-orderBy', `${orderByType} is not a valid orderby`);
    }
  }

  _validateDate(day, month, year) {
    const date = `${day}-${month}-${year}`;
    const dateMoment = moment(date, 'DD-MM-YYYY');
    const today = moment();

    if (!dateMoment.isValid()) {
      throw new DonationError('invalid-date', `${date} is not valid date`);
    }

    if (dateMoment.diff(today, 'days') < 0) {
      throw new DonationError('invalid-date', `${date} is before today's date`);
    }
  }

  _validateDateRange(fromDay, fromMonth, fromYear, toDay, toMonth, toYear) {
    const fromDate = `${fromDay}-${fromMonth}-${fromYear}`;
    const toDate = `${toDay}-${toMonth}-${toYear}`;

    const fromDateMoment = moment(fromDate, 'DD-MM-YYYY');
    const toDateMoment = moment(toDate, 'DD-MM-YYYY');

    if (toDateMoment.diff(fromDateMoment, 'days') < 1) {
      throw new DonationError('invalid-date-range', 'toDate needs to be 1 day or more than fromDate');
    }
  }

  _validateItemCondition(itemCondition) {
    const validItemConditions = [NEW, USED];
    if (!validItemConditions.includes(itemCondition)) {
      throw new DonationError('invalid-item-condition', `${itemCondition} is not a valid item condition`);
    }
  }

  _validateImageExtensions(images) {
    const validExtensions = ['.jpg', '.jpeg', '.png'];

    for (const image of images) {
      if (image == null) {
        throw new DonationError('invalid-image', 'provided image is null');
      }

      const imageExt = path.extname(image.name).toLowerCase();
      if (!validExtensions.includes(imageExt)) {
        throw new DonationError(
          'invalid-image-extension',
          `Only ${validExtensions.join(', ')} are valid image extensions`
        );
      }
    }
  }

  _validateUpdateImageExtensions(updateImages) {
    let imagesToValidate = [];

    for (const image of updateImages) {
      if (typeof image !== 'string') {
        imagesToValidate.push(image);
      }
    }

    this._validateImageExtensions(imagesToValidate);
  }

  _validateCoverImageAndImages(coverImage, images) {
    const isCoverImageIncluded = images.find((image) => {
      return image != null && coverImage != null && coverImage.name == image.name;
    });

    if (!isCoverImageIncluded) {
      throw new DonationError('invalid-cover-image', 'cover image does not exist in the list of images given');
    }
  }

  _validateCoverImageAndUpdateImages(coverImage, updateImages) {
    if (typeof coverImage !== 'string') {
      // Cover image is a new image
      this._validateCoverImageAndImages(coverImage, updateImages);
    } else {
      // Cover image is an existing one
      if (!updateImages.includes(coverImage)) {
        throw new DonationError('invalid-cover-image', 'cover image does not exist in the list of images given');
      }
    }
  }
}

export default DonationsAPI;
