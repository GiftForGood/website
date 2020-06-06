import { db } from '../firebase';

const bannersCollection = db.collection('banners');

class BannersAPI {
  async getAll() {
    return bannersCollection.where('shouldShow', '==', true).orderBy('index', 'asc').get();
  }
}

export default BannersAPI;
