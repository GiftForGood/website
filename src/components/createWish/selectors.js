function getLocalState(state) {
  return state.createWish;
}

export function getTitle(state) {
  return getLocalState(state).title;
}

export function getDescription(state) {
  return getLocalState(state).description;
}

export function getCategories(state) {
  return getLocalState(state).categories;
}
