export function setNpoOrganizationDetails(organization) {
  return {
    type: 'register/SET_NPO_ORG_DETAILS',
    organization,
  };
}

export function setNpoDetails(name, contactNumber) {
  return {
    type: 'register/SET_NPO_REGISTER_DETAILS',
    name,
    contactNumber,
  };
}

export function setIsNpoRegister() {
  return {
    type: 'register/SET_IS_NPO_REGISTER',
  };
}

export function setIsNpoDetails() {
  return {
    type: 'register/SET_IS_NPO_DETAILS',
  };
}

export function setIsDonorRegister() {
  return {
    type: 'register/SET_IS_DONOR_REGISTER',
  };
}

export function setIsBackToLanding() {
  return {
    type: 'register/SET_IS_BACK_TO_LANDING',
  };
}

export function setIsBackToNpoRegister() {
  return {
    type: 'register/SET_IS_BACK_TO_NPO_REGISTER',
  };
}
