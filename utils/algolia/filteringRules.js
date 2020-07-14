export const getByCategoryIdAndStatus = (categoryId, status) => {
  return `categories.id:'${categoryId}' AND status:'${status}'`;
};

export const getByStatus = (status) => {
  return `status:'${status}'`;
};
