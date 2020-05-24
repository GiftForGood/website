import axios from 'axios';
import { db, firebaseAuth, firebaseStorage } from '../firebase';
import * as moment from 'moment';
import * as path from 'path';
import { DONATIONS_BATCH_SIZE } from './constants';
import { NEW, USED } from '../constants/itemCondition';
import { TIMESTAMP } from '../constants/donationsSortType';
import DonationError from './error/donationsError';

const donationsCollection = db.collection('donations');

class DonationsAPI {
  /**
   * Create a new donation
   * @param {string} title The donation title text
   * @param {string} description The donation description text
   * @param {array} categories A list of category names that the donation belongs to
   * @param {number} validPeriodFromDay The valid date that the donation is valid from (day)
   * @param {number} validPeriodFromMonth The valid date that the donation is valid from (month)
   * @param {number} validPeriodFromYear The valid date that the donation is valid from (year)
   * @param {number} validPeriodToDay The valid date that the donation is valid to (day)
   * @param {number} validPeriodToMonth The valid date that the donation is valid to (month)
   * @param {number} validPeriodToYear The valid date that the donation is valid to (yes)
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
    let categoriesInfo = [];
    let userInfo = {};

    // Input validation
    this._validateDate(validPeriodFromDay, validPeriodFromMonth, validPeriodFromYear);
    this._validateDate(validPeriodToDay, validPeriodToMonth, validPeriodToYear);
    this._validateDatesRange(
      validPeriodFromDay,
      validPeriodFromMonth,
      validPeriodFromYear,
      validPeriodToDay,
      validPeriodToMonth,
      validPeriodToYear
    );
    this._validateItemCondition(itemCondition);
    this._validateImagesExtension(images);
    this._validateCoverImagesAndImages(coverImage, images);

    const validPeriodFromDate = `${validPeriodFromDay}-${validPeriodFromMonth}-${validPeriodFromYear}`;
    const validPeriodToDate = `${validPeriodToDay}-${validPeriodToMonth}-${validPeriodToYear}`;

    // Used a for loop instead of a forEach because forEach is not promise aware
    for (let i = 0; i < categories.length; i++) {
      let categoryInfo = await this._getCategoryInfoByName(categories[i]);

      if (Object.entries(categoryInfo).length !== 0) {
        categoriesInfo.push(categoryInfo);
      }
    }

    const allUserInfo = await this._getCurrentUserInfo();
    if (typeof allUserInfo === 'undefined') {
      throw new DonationError('invalid-current-user');
    }
    userInfo.userId = allUserInfo.userId;
    userInfo.userName = allUserInfo.name;
    userInfo.profileImageUrl = allUserInfo.profileImageUrl;

    let newDonation = donationsCollection.doc();
    const [coverImageUrl, imagesUrl] = await this._uploadNewImages(userInfo.userId, newDonation.id, images, coverImage);
    const locationsInfo = await this._getLocations(locations);

    let timeNow = Date.now();
    let data = {
      donationId: newDonation.id,
      title: title,
      description: description,
      status: 'pending',
      categories: categoriesInfo,
      user: userInfo,
      images: imagesUrl,
      coverImageUrl: coverImageUrl,
      validPeriodFrom: moment(validPeriodFromDate, 'DD-MM-YYYY').valueOf(),
      validPeriodTo: moment(validPeriodToDate, 'DD-MM-YYYY').valueOf(),
      dimensions: dimensions,
      locations: locationsInfo,
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
    const categoryInfo = await this._getCategoryInfoById(categoryId);
    return donationsCollection
      .where('categories', 'array-contains', categoryInfo)
      .where('status', '==', 'pending')
      .orderBy('postedDateTime', 'desc')
      .limit(n)
      .get();
  }

  /**
   * Gets a batch of all pending donations. Only return results of DONATIONS_BATCH_SIZE
   * @param {string} orderBy The way to order the donations
   * @param {boolean} isReverse Indicates if the query should be ordered in reverse
   * @param {object} lastQueriedDocument The last queried firebase document to start the query after. If the field is not given, the query will start from the first document
   * @throws {DonationError}
   * @returns {array} A list of firebase document of all ordered pending donations
   */
  async getAllPendingDonations(orderBy = TIMESTAMP, isReverse = false, lastQueriedDocument = null) {
    // TODO: Sort by distance not implemented
    this._validateOrderBy(orderBy);

    let sortOrder = 'asc';
    if (isReverse) {
      sortOrder = 'desc';
    }

    if (lastQueriedDocument == null) {
      // First page
      return donationsCollection
        .where('status', '==', 'pending')
        .orderBy(orderBy, sortOrder)
        .limit(DONATIONS_BATCH_SIZE)
        .get();
    } else {
      // Subsequent pages
      return donationsCollection
        .where('status', '==', 'pending')
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

    const categoryInfo = await this._getCategoryInfoById(categoryId);

    if (lastQueriedDocument == null) {
      // First page
      return donationsCollection
        .where('categories', 'array-contains', categoryInfo)
        .where('status', '==', 'pending')
        .orderBy(orderBy, sortOrder)
        .limit(DONATIONS_BATCH_SIZE)
        .get();
    } else {
      // Subsequent pages
      return donationsCollection
        .where('categories', 'array-contains', categoryInfo)
        .where('status', '==', 'pending')
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
  async getDonation(id) {
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
        .orderBy('postedDateTime', 'desc')
        .limit(DONATIONS_BATCH_SIZE)
        .get();
    } else {
      // Subsequent pages
      return donationsCollection
        .where('user.userId', '==', donorId)
        .orderBy('postedDateTime', 'desc')
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
   * @return {object} A list of firebase document of donations belonging a donor, filtered by status
   */
  async getDonorDonationsFilterByStatus(donorId, status, lastQueriedDocument = null) {
    if (lastQueriedDocument == null) {
      // First page
      return donationsCollection
        .where('user.userId', '==', donorId)
        .where('status', '==', status.toLowerCase())
        .orderBy('postedDateTime', 'desc')
        .limit(DONATIONS_BATCH_SIZE)
        .get();
    } else {
      // Subsequent pages
      return donationsCollection
        .where('user.userId', '==', donorId)
        .where('status', '==', status.toLowerCase())
        .orderBy('postedDateTime', 'desc')
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
   * @param {array} categories A list of category names that the donation belongs to
   * @param {number} validPeriodFromDay The valid date that the donation is valid from (day)
   * @param {number} validPeriodFromMonth The valid date that the donation is valid from (month)
   * @param {number} validPeriodFromYear The valid date that the donation is valid from (year)
   * @param {number} validPeriodToDay The valid date that the donation is valid to (day)
   * @param {number} validPeriodToMonth The valid date that the donation is valid to (month)
   * @param {number} validPeriodToYear The valid date that the donation is valid to (yes)
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
  async updateDonation(
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
    this._validateDatesRange(
      validPeriodFromDay,
      validPeriodFromMonth,
      validPeriodFromYear,
      validPeriodToDay,
      validPeriodToMonth,
      validPeriodToYear
    );
    this._validateItemCondition(itemCondition);
    this._validateUpdateImagesExtension(images);
    this._validateCoverImageAndUpdateImages(coverImage, images);

    const donationInfo = await this._getDonationInfo(id);
    if (typeof donationInfo === 'undefined') {
      throw new DonationError('invalid-donation-id', 'donation does not exist');
    }

    if (donationInfo.status !== 'pending') {
      throw new DonationError('invalid-donation-status', 'Only can update a pending donation');
    }

    const validPeriodFromDate = `${validPeriodFromDay}-${validPeriodFromMonth}-${validPeriodFromYear}`;
    const validPeriodToDate = `${validPeriodToDay}-${validPeriodToMonth}-${validPeriodToYear}`;

    const categoriesInfo = await this._getDonationCategoriesInfo(donationInfo.categories, categories);
    const locationsInfo = await this._getDonationLocations(donationInfo.locations, locations);

    const [coverImageUrl, imagesUrl] = await this._getDonationImages(
      donationInfo.user.userId,
      donationInfo.donationId,
      donationInfo.images,
      images,
      coverImage
    );

    const data = {
      title: title,
      description: description,
      categories: categoriesInfo,
      images: imagesUrl,
      coverImageUrl: coverImageUrl,
      validPeriodFrom: moment(validPeriodFromDate, 'DD-MM-YYYY').valueOf(),
      validPeriodTo: moment(validPeriodToDate, 'DD-MM-YYYY').valueOf(),
      dimensions: dimensions,
      locations: locationsInfo,
      itemCondition: itemCondition,
      updatedDateTime: Date.now(),
    };

    const donationDoc = donationsCollection.doc(id);
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
  async closeDonation(id, reason) {
    const donationInfo = await this._getDonationInfo(id);
    if (typeof donationInfo === 'undefined') {
      throw new DonationError('invalid-donation-id', 'donation does not exist');
    }

    if (donationInfo.status !== 'pending') {
      throw new DonationError('invalid-donation-status', 'Only can close a pending donation');
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

    const donationDoc = donationsCollection.doc(id);
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
  async completeDonation(id, npoId) {
    const donationInfo = await this._getDonationInfo(id);
    const npoInfo = await this._getNPOInfo(npoId);
    if (typeof donationInfo === 'undefined') {
      throw new DonationError('invalid-donation-id', 'donation does not exist');
    }
    if (typeof npoInfo === 'undefined') {
      throw new DonationError('invalid-npo-id', `${npoId} is not valid`);
    }

    if (donationInfo.status !== 'pending') {
      throw new DonationError('invalid-donation-status', 'Only can complete a pending donation');
    }

    const organizationInfo = {
      name: npoInfo.organization.name,
      address: npoInfo.organization.address,
    };

    const updateTime = Date.now();
    const data = {
      updatedDateTime: updateTime,
      status: 'completed',
      completed: {
        npoUserId: npoInfo.userId,
        organization: organizationInfo,
        npoName: npoInfo.name,
        npoProfileImageUrl: npoInfo.profileImageUrl,
        dateTime: updateTime,
      },
    };

    const donationDoc = donationsCollection.doc(id);
    await donationDoc.update(data);

    return donationDoc.get();
  }

  async _getCurrentUserInfo() {
    const user = firebaseAuth.currentUser;

    if (user == null) {
      return {};
    }

    const userId = user.uid;
    return this._getDonorInfo(userId);
  }

  async _getDonorInfo(id) {
    const snapshot = await db.collection('donors').doc(id).get();
    return snapshot.data();
  }

  async _getDonationInfo(id) {
    const snapshot = await donationsCollection.doc(id).get();
    return snapshot.data();
  }

  async _getCategoryInfoById(id) {
    const snapshot = await db.collection('categories').doc(id).get();
    return snapshot.data();
  }

  async _getCategoryInfoByName(name) {
    let snapshot = await db.collection('categories').where('name', '==', name).get();

    // Assumes that categories name are unique
    if (snapshot.empty) {
      return {};
    }

    return snapshot.docs[0].data();
  }

  async _getNPOInfo(id) {
    let snapshot = await db.collection('npos').doc(id).get();
    return snapshot.data();
  }

  async _uploadNewImages(userId, donationId, images, coverImage) {
    let imagesUrl = [];
    let coverImageUrl = '';

    let imageId = 1;
    for (const image of images) {
      const ext = path.extname(image.name);
      let imageName = donationId;
      const isCoverImage = image.name == coverImage.name;
      if (isCoverImage) {
        imageName += `_cover${ext}`;
      } else {
        imageName += `_${imageId++}${ext}`;
      }

      const imageUrl = await this._uploadImage(userId, donationId, image, imageName);
      imagesUrl.push(imageUrl);
      if (isCoverImage) {
        coverImageUrl = imageUrl;
      }
    }

    return [coverImageUrl, imagesUrl];
  }

  async _overwriteImages(userId, donationId, images, imagesName, coverImage) {
    // Assumes that if cover image is a new image, it should existing in the images and has a name in imagesName
    // Assumes that length of images == length of imagesName
    let imagesUrl = [];
    let coverImageUrl = '';

    if (typeof coverImage === 'string') {
      coverImageUrl = coverImage;
    }

    let imageIndex = 0;
    for (const imageName of imagesName) {
      let imageToUpload;

      const isCoverImageName = imageName.includes('cover');
      const isCoverImage = typeof coverImage !== 'string' && images[imageIndex].name == coverImage.name;

      if (isCoverImageName) {
        imageToUpload = coverImage;
      } else if (isCoverImage) {
        // Take the next image
        imageToUpload = images[++imageIndex];
      } else {
        imageToUpload = images[imageIndex++];
      }

      const imageUrl = await this._uploadImage(userId, donationId, imageToUpload, imageName);
      imagesUrl.push(imageUrl);
      if (isCoverImageName) {
        coverImageUrl = imageUrl;
      }
    }

    return [coverImageUrl, imagesUrl];
  }

  async _uploadImage(userId, donationId, image, imageName) {
    const storageRef = firebaseStorage.ref();
    const imageRef = storageRef.child(`donors/${userId}/donations/${donationId}/${imageName}`);
    await imageRef.put(image);

    return imageRef.getDownloadURL();
  }

  async _getLocations(locations) {
    let locationsDetails = [];

    for (const location of locations) {
      try {
        const geoLocationUrl = 'https://maps.googleapis.com/maps/api/geocode/json';
        let res = await axios.get(`${geoLocationUrl}?address=${location}&key=${process.env.FIREBASE_API_KEY}`);
        if (res.status != 200) {
          continue;
        }

        if (res.data.status !== 'OK') {
          continue;
        }

        const fullAddress = res.data.results[0]['formatted_address'];
        const lat = res.data.results[0]['geometry']['location']['lat'];
        const long = res.data.results[0]['geometry']['location']['lng'];

        const locationDetail = {
          name: location,
          fullAddress: fullAddress,
          latitude: lat,
          longitude: long,
        };
        locationsDetails.push(locationDetail);
      } catch (error) {
        continue;
      }
    }

    return locationsDetails;
  }

  async _getDonationCategoriesInfo(existingCategories, updatedCategoriesName) {
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

  async _getDonationLocations(existingLocations, updatedLocations) {
    let locations = [];
    let locationsToQuery = [];

    for (const location of updatedLocations) {
      const locationIndex = existingLocations.findIndex((existingLocation) => {
        return existingLocation.name === location;
      });

      if (locationIndex === -1) {
        locationsToQuery.push(location);
      } else {
        locations.push(existingLocations[locationIndex]);
      }
    }

    const newLocations = await this._getLocations(locationsToQuery);

    return [...locations, ...newLocations];
  }

  async _getDonationImages(userId, donationId, existingImages, updatedImages, coverImage) {
    let imagesUrl = [];
    let newImagesObject = [];
    let existingImagesIndexes = [];
    let imagesNameToOverwrite = [];

    for (const image of updatedImages) {
      if (typeof image === 'string') {
        // Existing images
        const existingImageIndex = existingImages.findIndex((existingImageUrl) => {
          return existingImageUrl === image;
        });

        if (existingImageIndex === -1) {
          throw new DonationError('invalid-image-url', 'the image url should be an existing image url');
        }

        existingImagesIndexes.push(existingImageIndex);
        imagesUrl.push(image);
      } else {
        // New images
        newImagesObject.push(image);
      }
    }

    const imageNameRe = /%2..*%2F(.*?)\?alt/;
    for (let i = 0; i < existingImages.length; i++) {
      if (!existingImagesIndexes.includes(i)) {
        const imageNameArray = existingImages[i].match(imageNameRe);

        if (imageNameArray == null || imageNameArray.length < 1) {
          throw new DonationError('invalid-image-url', 'failed to retrieve image name from url provided');
        }

        imagesNameToOverwrite.push(imageNameArray[1]);
      }
    }

    const [coverImageUrl, newImagesUrl] = await this._overwriteImages(
      userId,
      donationId,
      newImagesObject,
      imagesNameToOverwrite,
      coverImage
    );

    return [coverImageUrl, [...imagesUrl, ...newImagesUrl]];
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
      throw new DonationError('invalid-date', `${date} is not valid`);
    }

    if (dateMoment.diff(today, 'days') < 0) {
      throw new DonationError('invalid-date', `${date} is before today's date`);
    }
  }

  _validateDatesRange(fromDay, fromMonth, fromYear, toDay, toMonth, toYear) {
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

  _validateImagesExtension(images) {
    const validExtensions = ['.jpg', 'jpeg', 'png'];

    for (const image of images) {
      if (image == null) {
        throw new DonationError('invalid-image', 'provided image is null');
      }

      const imageExt = path.extname(image.name);
      if (!validExtensions.includes(imageExt)) {
        throw new DonationError('invalid-image-extension', `${imageExt} is not a valid image extension`);
      }
    }
  }

  _validateUpdateImagesExtension(updateImages) {
    let imagesToValidate = [];

    for (const image of updateImages) {
      if (typeof image !== 'string') {
        imagesToValidate.push(image);
      }
    }

    this._validateImagesExtension(imagesToValidate);
  }

  _validateCoverImagesAndImages(coverImage, images) {
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
      for (const image of updateImages) {
        if (typeof image === 'string' && image.includes('cover')) {
          throw new DonationError(
            'invalid-new-cover-image',
            'new cover image is provided and existing images urls should not include a cover image url'
          );
        }
      }

      this._validateCoverImagesAndImages(coverImage, updateImages);
    } else {
      if (!updateImages.includes(coverImage)) {
        throw new DonationError('invalid-cover-image', 'cover image does not exist in the list of images given');
      }
    }
  }
}

export default DonationsAPI;
