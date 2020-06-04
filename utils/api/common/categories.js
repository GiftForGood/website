import { db } from '../../firebase';
import CategoryError from '../error/categoryError';

export const getCategoryInfo = async (id) => {
  const snapshot = await db.collection('categories').doc(id).get();

  if (!snapshot.exists) {
    throw new CategoryError('invalid-category-id', 'category does not exist');
  }

  return snapshot.data();
};

export const getAllCategoryInfos = async (categoriesId) => {
  const categoriesPromise = categoriesId.map((categoryId) => {
    return getCategoryInfo(categoryId);
  });

  return await Promise.all(categoriesPromise);
};

export const getUpdatedCategoryInfos = async (existingCategories, updatedCategoriesId) => {
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

  const newCategoriesInfo = await getAllCategoryInfos(newCategoriesIdToQuery);

  return [...categoriesInfo, ...newCategoriesInfo];
};

export const getCustomPostCategoryInfo = (category) => {
  const postCategoryInfo = {
    id: category.id,
    name: category.name,
  };

  return postCategoryInfo;
};

export const getCustomPostCategoryInfos = (categories) => {
  let postCategoryInfos = [];

  for (const category of categories) {
    postCategoryInfos.push(getCustomPostCategoryInfo(category));
  }

  return postCategoryInfos;
};
