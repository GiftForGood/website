const initialState = {
  height: 0,
};

const navbarReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'navbar/SET_HEIGHT':
      return {
        ...state,
        height: action.height,
      };

    default:
      return state;
  }
};

export default navbarReducer;
