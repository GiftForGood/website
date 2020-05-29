const initialState = {
  title: '',
  description: '',
  categories: [],
};

const createWishReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'create-wish/SET_TITLE':
      return {
        ...state,
        title: action.title,
      };

    case 'create-wish/SET_DESCRIPTION':
      return {
        ...state,
        description: action.description,
      };

    case 'create-wish/ADD_CATEGORY':
      return {
        ...state,
        categories: [...state.categories, action.category],
      };

    case 'create-wish/SET_ALL_CATEGORIES':
      return {
        ...state,
        categories: action.categories,
      };
    default:
      return state;
  }
};

export default createWishReducer;
