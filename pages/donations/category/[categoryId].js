import React from 'react';
import api from '@api';
import ViewCategoryPage from '@components/category/pages/DonationsViewCategoryPage';
import dynamic from 'next/dynamic';
import SessionProvider from '@components/session/modules/SessionProvider';
import { isAuthenticated } from '@utils/authentication/authentication';
import Error from 'next/error';
import Header from '@components/header';
import { DONATIONS } from '@constants/search';

const TopNavigationBar = dynamic(() => import('@components/navbar/modules/TopNavigationBar'), {
  ssr: false,
});
const BottomNavigation = dynamic(() => import('@components/navbar/modules/BottomNavigation'), {
  ssr: false,
});
const Footer = dynamic(() => import('@components/footer/Footer'), { ssr: false });

export async function getServerSideProps({ params, query, req, res }) {
  const [categoryDetails, user] = await Promise.all([getCategoryDetails(params.categoryId), isAuthenticated(req, res)]);
  return {
    props: {
      categoryDetails,
      sortByQuery: query.sortBy ? query.sortBy : null,
      user,
    },
  };
}

const getCategoryDetails = async (categoryId) => {
  const rawCategory = await api.categories.getById(categoryId).catch((err) => console.error(err));
  if (!rawCategory.exists) {
    return {};
  }
  return rawCategory.data();
};

const ViewCategory = ({ categoryDetails, sortByQuery, user }) => {
  if (Object.keys(categoryDetails).length === 0) {
    return <Error />;
  }
  return (
    <SessionProvider user={user}>
      <Header title={`${categoryDetails.name} | Donations`} />
      <TopNavigationBar showNews={true} searchDefaultIndex={DONATIONS} />
      <ViewCategoryPage categoryDetails={categoryDetails} sortByQuery={sortByQuery} />
      <BottomNavigation />
      <Footer />
    </SessionProvider>
  );
};

export default ViewCategory;
