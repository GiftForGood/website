function getLocalState(state) {
	return state.register;
}

export function getName(state) {
	return getLocalState(state).name;
}

export function getContactNumber(state) {
	return getLocalState(state).contactNumber;
}

export function getOrganization(state) {
	return getLocalState(state).organization;
}

export function getCurrentPage(state) {
	return getLocalState(state).currentPage;
}

