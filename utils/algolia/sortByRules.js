export const wishesSortByRule = () => {
  return {
    items: [
      { value: 'wishes', label: 'Newest - Oldest' },
      { value: 'wishes_npo_name_asc', label: 'NPO Name (A-Z)' },
      { value: 'wishes_npo_name_desc', label: 'NPO Name (Z-A)' },
    ],
    defaultRefinement: 'wishes',
  };
};

export const donationsSortByRule = () => {
  return {
    items: [{ value: 'donations', label: 'Newest - Oldest' }],
    defaultRefinement: 'donations',
  };
};

export const nposSortByRule = () => {
  return {
    items: [
      { value: 'npos_name_asc', label: 'NPO Name (A-Z)' },
      { value: 'npos_name_desc', label: 'NPO Name (Z-A)' },
    ],
    defaultRefinement: 'npos_name_asc',
  };
};
