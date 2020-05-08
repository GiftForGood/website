import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from "redux-thunk";
import logger from "redux-logger";
// import sessionReducer from "./components/session";
// import buildReducer from "./components/build";
// import navbarReducer from "./components/nav";
// import browseReducer from './components/browse';

const initialState = {};

const rootReducer = combineReducers({
  // session: sessionReducer,
  // build: buildReducer,
  // navbar: navbarReducer,
  // browse: browseReducer
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
