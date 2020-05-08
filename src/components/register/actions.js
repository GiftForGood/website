export function setNpoOrganizationDetails(organization) {
	return {
		type: 'signup/SET_NPO_ORG_DETAILS',
		organization,
	};
}

export function setIsNpoRegister() {
	return {
		type: 'signup/SET_IS_NPO_REGISTER',
	};
}

export function setIsNpoDetails() {
	return {
		type: 'signup/SET_IS_NPO_DETAILS',
	};
}

export function setIsDonorRegister() {
	return {
		type: 'signup/SET_IS_DONOR_REGISTER',
	};
}

export function setIsBackToLanding() {
	return {
		type: 'signup/SET_IS_BACK_TO_LANDING',
	};
}

export function setIsBackToNpoRegister() {
	return {
		type: 'signup/SET_IS_BACK_TO_NPO_REGISTER',
	};
}
