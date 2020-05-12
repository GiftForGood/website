import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from "redux-thunk";
import logger from "redux-logger";

import registerReducer from "./src/components/register";
import loginReducer from "./src/components/login";

const initialState = {};

const rootReducer = combineReducers({
  register: registerReducer,
  login: loginReducer
});

const middlewares = [thunk];
if (process.env.NODE_ENV === "development") {
  middlewares.push(logger);
}

export const initializeStore = (preloadedState = initialState) => {
  return createStore(
    rootReducer,
    preloadedState,
    applyMiddleware(...middlewares)
  );
};
