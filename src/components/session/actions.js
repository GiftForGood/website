export function logout() {
  return {
    type: 'session/LOGOUT',
  };
}

export function setCurrentUser(userData) {
  return {
    type: 'session/SET_CURRENT_USER',
    userData,
  };
}

export function updateCurrentUser(userData) {
  return {
    type: 'session/UPDATE_CURRENT_USER',
    userData,
  };
}
