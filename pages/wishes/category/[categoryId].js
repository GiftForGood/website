import React from 'react';
import api from '../../../utils/api';
import ViewCategoryPage from '../../../src/components/category/ViewCategoryPage';

export async function getServerSideProps({ params, query }) {
  const categoryDetails = await getCategoryDetails(params.categoryId);
  return {
    props: {
      categoryDetails,
      filterQuery: query.filter,
    },
  };
}

const getCategoryDetails = async (categoryId) => {
  const rawCategory = await api.categories.getById(categoryId);
  return rawCategory.docs[0].data();
};

const ViewCategory = ({ categoryDetails, filterQuery }) => {
  return <ViewCategoryPage categoryDetails={categoryDetails} filterQuery={filterQuery} />;
};

export default ViewCategory;
