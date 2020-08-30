import { db } from '../firebase';

const bannersCollection = db.collection('banners');

class BannersAPI {
  async getAllMain() {
    return bannersCollection.where('type', '==', 'main').where('shouldShow', '==', true).orderBy('index', 'asc').get();
  }

  async getAllSide() {
    return bannersCollection.where('type', '==', 'side').where('shouldShow', '==', true).orderBy('index', 'asc').get();
  }
}

export default BannersAPI;
