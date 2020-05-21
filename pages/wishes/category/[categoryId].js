import React from 'react';
import api from '../../../utils/api';
import * as WishesSortTypeConstant from '../../../utils/constants/wishesSortType';
import ViewCategoryPage from '../../../src/components/category/ViewCategoryPage';

export async function getServerSideProps({ params }) {
  const categoryDetails = await getCategoryDetails(params.categoryId);
  return {
    props: {
      categoryDetails,
    },
  };
}

const getCategoryDetails = async (categoryId) => {
  const rawCategory = await api.categories.getById(categoryId);
  return rawCategory.docs[0].data();
};


const ViewCategory = ({ categoryDetails }) => {
  return <ViewCategoryPage categoryDetails={categoryDetails} />;
};

export default ViewCategory;
