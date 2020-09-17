export const getByCategoryIdAndStatus = (categoryId, status) => {
  return `categories.id:'${categoryId}' AND status:'${status}'`;
};

export const getByCategoryIdAndStatusAndNotExpired = (categoryId, status, currentDateTime) => {
  return `categories.id:'${categoryId}' AND status:'${status}' AND expireDateTime >= ${currentDateTime}`;
};

export const getByStatus = (status) => {
  return `status:'${status}'`;
};

export const getByStatusAndNotExpired = (status, currentDateTime) => {
  return `status:'${status}' AND expireDateTime >= ${currentDateTime}`;
};

export const getNpoNotBlocked = () => {
  return `isBlocked: '${false}'`;
};
