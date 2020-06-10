function getLocalState(state) {
  return state.createDonation;
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

export function getValidFrom(state) {
  return getLocalState(state).validFrom;
}

export function getValidTo(state) {
  return getLocalState(state).validTo;
}

export function getLocation(state) {
  return getLocalState(state).location;
}

export function getCoverImage(state) {
  return getLocalState(state).coverImage;
}
