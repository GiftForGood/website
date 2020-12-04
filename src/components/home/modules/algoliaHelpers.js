import { searchClient } from '@utils/algolia';

export const getTopNCategoriesFromAlgoliaWithExpireDateTime = async (algoliaIndex) => {
  const index = searchClient.initIndex(algoliaIndex);
  return index.search('', {
    facets: ['categories.id'],
    facetFilters: [['status:pending']],
    // numericFilters: [[`expireDateTime >= ${Date.now()}`]]
  });
};

export const getTopNCategoriesFromAlgolia = async (algoliaIndex) => {
  const index = searchClient.initIndex(algoliaIndex);
  return index.search('', {
    facets: ['categories.id'],
    facetFilters: [['status:pending']],
  });
};

export const sortObjectEntries = (obj) => {
  return Object.entries(obj)
    .sort((a, b) => b[1] - a[1])
    .map((element) => element[0]);
};
