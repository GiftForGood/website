import React from 'react';
import api from '../../../utils/api';
import ViewCategoryPage from '../../../src/components/category/pages/WishesViewCategoryPage';

export async function getServerSideProps({ params, query }) {
  const categoryDetails = await getCategoryDetails(params.categoryId);
  return {
    props: {
      categoryDetails,
      filterQuery: query.filter ? query.filter : null,
    },
  };
}

const getCategoryDetails = async (categoryId) => {
  const rawCategory = await api.categories.getById(categoryId).catch((err) => console.error(err));
  return rawCategory.docs[0].data();
};

const ViewCategory = ({ categoryDetails, filterQuery }) => {
  return <ViewCategoryPage categoryDetails={categoryDetails} filterQuery={filterQuery} />;
};

export default ViewCategory;
