export const getByCategoryIdAndStatus = (categoryId, status) => {
  return `categories.id:'${categoryId}' AND status:'${status}'`;
};

export const getByCategoryIdAndStatusAndNotExpired = (categoryId, status, currentDateTime) => {
  return `categories.id:'${categoryId}' AND status:'${status}'`;
};

export const getByStatus = (status) => {
  return `status:'${status}'`;
};

export const getByStatusAndNotExpired = (status, currentDateTime) => {
  return `status:'${status}'`;
};

export const getNpoNotBlocked = () => {
  return `isBlocked: '${false}'`;
};

export const getNpoWishes = (orgId) => {
  return `organization.id: '${orgId}'`;
};
