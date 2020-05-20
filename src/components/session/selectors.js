function getLocalState(state) {
  return state.session;
}

export function getUser(state) {
  return getLocalState(state).user;
}
