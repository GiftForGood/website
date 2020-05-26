export function setTitle(title) {
  return {
    type: 'create-wish/SET_TITLE',
    title,
  };
}

export function setDescription(description) {
  return {
    type: 'create-wish/SET_DESCRIPTION',
    description,
  };
}

export function addCategory(category) {
  return {
    type: 'create-wish/ADD_CATEGORY',
    category,
  };
}

export function setAllCategories(categories) {
  return {
    type: 'create-wish/SET_ALL_CATEGORIES',
    categories,
  };
}