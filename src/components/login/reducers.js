import { LANDING, NPO_LOGIN, DONOR_LOGIN } from './utils/SubPages';
const initialState = {
  currentPage: LANDING,
};

const loginReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'login/SET_IS_NPO_LOGIN':
      return {
        ...state,
        currentPage: NPO_LOGIN,
      };

    case 'login/SET_IS_DONOR_LOGIN':
      return {
        ...state,
        currentPage: DONOR_LOGIN,
      };

    case 'login/SET_IS_BACK_TO_LANDING':
      return {
        ...state,
        currentPage: LANDING,
      };

    default:
      return state;
  }
};

export default loginReducer;
