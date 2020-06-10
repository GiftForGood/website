const initialState = {
  title: '',
  description: '',
  categories: [],
  validFrom: '',
  validTo: '',
  coverImage: null,
  location: '',
};

const createDonationReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'create-donation/SET_TITLE':
      return {
        ...state,
        title: action.title,
      };

    case 'create-donation/SET_DESCRIPTION':
      return {
        ...state,
        description: action.description,
      };

    case 'create-donation/ADD_CATEGORY':
      return {
        ...state,
        categories: [...state.categories, action.category],
      };

    case 'create-donation/SET_ALL_CATEGORIES':
      return {
        ...state,
        categories: action.categories,
      };
    case 'create-donation/SET_VALID_FROM':
      return {
        ...state,
        validFrom: action.validFrom,
      };

    case 'create-donation/SET_VALID_TO':
      return {
        ...state,
        validTo: action.validTo,
      };

    case 'create-donation/SET_LOCATION':
      return {
        ...state,
        location: action.location,
      };

    case 'create-donation/SET_COVER_IMAGE':
      return {
        ...state,
        coverImage: action.coverImage,
      };
    default:
      return state;
  }
};

export default createDonationReducer;
