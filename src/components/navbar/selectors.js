function getLocalState(state) {
  return state.navbar;
}

export function getHeight(state) {
  return getLocalState(state).height;
}
