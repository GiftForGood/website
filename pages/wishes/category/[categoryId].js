import React from 'react';
import api from '../../../utils/api';
import * as WishesSortTypeConstant from '../../../utils/constants/wishesSortType';
import ViewCategoryPage from '../../../src/components/category/ViewCategoryPage';

export async function getServerSideProps({ params }) {
  const categoryDetails = await getCategoryDetails(params.categoryId);
  const firstBatchOfWishes = await getFirstBatchOfWishes(params.categoryId, WishesSortTypeConstant.TIMESTAMP);
  return {
    props: {
      categoryDetails,
      firstBatchOfWishes,
    },
  };
}

const getCategoryDetails = async (categoryId) => {
  const rawCategory = await api.categories.getById(categoryId);
  return rawCategory.docs[0].data();
};

const getFirstBatchOfWishes = async (category, filter) => {
  const rawWishes = await api.wishes.getPendingWishesForCategory(category, filter).catch((err) => console.error(err));
  return rawWishes.docs.map((doc) => doc.data());
};

const ViewCategory = ({ categoryDetails, firstBatchOfWishes }) => {
  return <ViewCategoryPage categoryDetails={categoryDetails} firstBatchOfWishes={firstBatchOfWishes} />;
};

export default ViewCategory;
