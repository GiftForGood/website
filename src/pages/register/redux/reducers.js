import { LANDING, NPO_REGISTER, DONOR_REGISTER, NPO_DETAILS } from '../constants/subPages';
const initialState = {
  organization: null,
  name: '',
  contactNumber: '',
  currentPage: LANDING,
};

const registerReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'register/SET_NPO_ORG_DETAILS':
      return {
        ...state,
        organization: action.organization,
      };

    case 'register/CLEAR_NPO_ORG_DETAILS':
      return {
        ...state,
        organization: null,
      };

    case 'register/SET_NPO_REGISTER_DETAILS':
      return {
        ...state,
        name: action.name,
        contactNumber: action.contactNumber,
      };

    case 'register/SET_IS_NPO_REGISTER':
      return {
        ...state,
        currentPage: NPO_REGISTER,
      };

    case 'register/SET_IS_DONOR_REGISTER':
      return {
        ...state,
        currentPage: DONOR_REGISTER,
      };

    case 'register/SET_IS_BACK_TO_LANDING':
      return {
        ...state,
        currentPage: LANDING,
      };

    case 'register/SET_IS_BACK_TO_NPO_REGISTER':
      return {
        ...state,
        currentPage: NPO_REGISTER,
      };

    case 'register/SET_IS_NPO_DETAILS':
      return {
        ...state,
        currentPage: NPO_DETAILS,
      };
    default:
      return state;
  }
};

export default registerReducer;
