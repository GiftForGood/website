export const LEGAL_TYPE = {
  PRIVACY_POLICY: 'privacy_policy',
  TNC_GENERAL: 'tnc_general',
  TNC_NPO: 'tnc_npo',
  TNC_DONOR: 'tnc_donor',
};

export const LEGAL_TYPE_CHOICE = {
  PRIVACY_POLICY: 'privacy',
  TNC_GENERAL: 'T&C General',
  TNC_NPO: 'T&C NPO',
  TNC_DONOR: 'T&C Donor',
};

export const isValidType = (type) => {
  return Object.values(LEGAL_TYPE).includes(type);
};
