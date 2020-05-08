import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from "redux-thunk";
import logger from "redux-logger";

import registerReducer from "./src/components/register";

const initialState = {};

const rootReducer = combineReducers({
  register: registerReducer,
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
