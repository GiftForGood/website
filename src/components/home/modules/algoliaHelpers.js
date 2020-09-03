import algoliasearch from 'algoliasearch/lite';
const searchClient = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_SEARCH_KEY);

export const getTopNCategoriesFromAlgoliaWithExpireDateTime = async (algoliaIndex) => {
  const index = searchClient.initIndex(algoliaIndex);
  return index.search('', {
    facets: ['categories.id'],
    facetFilters: [['status:pending'], [`expireDateTime >= ${Date.now()}`]],
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
