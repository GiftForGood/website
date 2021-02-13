function getLocalState(state) {
  return state.login;
}

export function getCurrentPage(state) {
  return getLocalState(state).currentPage;
}
