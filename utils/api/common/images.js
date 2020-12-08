import { firebaseStorage } from '../../firebase';
import * as path from 'path';

const getPath = (path) => {
  let finalPath = path;
  if (finalPath.substr(-1) !== '/') {
    finalPath += '/';
  }

  return path;
};

export const isValidImageExtensions = (images) => {
  const validExtensions = ['.jpg', '.jpeg', '.png'];

  for (const image of images) {
    if (image == null) {
      return false;
    }

    const imageExt = path.extname(image.name).toLowerCase();
    if (!validExtensions.includes(imageExt)) {
      return false;
    }
  }

  return true;
};

export const getImageVariations = (imageName) => {
  let imageArr = imageName.split('.');
  const ext = '.' + imageArr.pop();
  const name = imageArr.join('.');

  let imageVariations = [];
  for (const variation of VARIATIONS) {
    const imageVariation = `${name}_${variation}${ext}`;
    imageVariations.push(imageVariation);
  }

  return imageVariations;
};

export const uploadImage = async (image, imageName, pathToUpload) => {
  const path = getPath(pathToUpload);

  const storageRef = firebaseStorage.ref();
  const imageRef = storageRef.child(`${path}${imageName}`);
  await imageRef.put(image);

  return imageRef.getDownloadURL();
};

export const deleteImages = async (imageNames, pathPrefix) => {
  for (const imageName of imageNames) {
    deleteImage(imageName, pathPrefix);
  }
};

export const deleteImage = async (imageName, pathToImage) => {
  const path = getPath(pathToImage);

  const storageRef = firebaseStorage.ref();
  const imageRef = storageRef.child(`${path}${imageName}`);
  imageRef.delete();
};

export const getExistingImageNames = async (path) => {
  const imageNames = [];

  const storageRef = firebaseStorage.ref();
  const imageRefs = storageRef.child(path);
  const existingStorageImageRefs = await imageRefs.listAll();

  existingStorageImageRefs.items.forEach((existingStorageImageRefItem) => {
    imageNames.push(existingStorageImageRefItem.name);
  });

  return imageNames;
};
