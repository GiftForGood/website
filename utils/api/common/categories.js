export const getAllCategoryInfos = async (categoriesId) => {
  const categoriesPromise = categoriesId.map((categoryId) => {
    return this._getCategoryInfo(categoryId);
  });

  return await Promise.all(categoriesPromise);
}

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
}
