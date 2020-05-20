const initialState = {
  user: null,
};

const sessionReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'session/SET_CURRENT_USER':
      return {
        ...state,
        ...action.userData,
      };

    case 'session/UPDATE_CURRENT_USER':
      return {
        ...state,
        user: {
          ...state.user,
          ...action.userData,
        },
      };
    case 'session/LOGOUT':
      return {
        ...initialState,
      };

    default:
      return state;
  }
};

export default sessionReducer;
