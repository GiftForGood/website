import React from 'react';
import dynamic from 'next/dynamic';

// components
import Header from '@components/header';
import SessionProvider from '@components/session/modules/SessionProvider';
import ViewAllWishesPage from '@pages/category/wishes/all';

// utils and components
import { WISHES } from '@constants/search';
import { isAuthenticated } from '@utils/authentication/authentication';

// dynamic imports
const TopNavigationBar = dynamic(() => import('@components/navbar/modules/TopNavigationBar'), {
  ssr: false,
});
const BottomNavigation = dynamic(() => import('@components/navbar/modules/BottomNavigation'), {
  ssr: false,
});
const Footer = dynamic(() => import('@components/footer/Footer'), { ssr: false });

export async function getServerSideProps({ query, req, res }) {
  let user = await isAuthenticated(req, res);
  return {
    props: {
      sortByQuery: query.sortBy ? query.sortBy : null,
      query: query.q ? query.q : '',
      user,
    },
  };
}

const ViewAllWishes = ({ sortByQuery, user, query }) => {
  return (
    <SessionProvider user={user}>
      <Header title={`All | Wishes`} />
      <TopNavigationBar showNews={true} searchDefaultIndex={WISHES} />
      <ViewAllWishesPage sortByQuery={sortByQuery} query={query} />
      <BottomNavigation />
      <Footer />
    </SessionProvider>
  );
};

export default ViewAllWishes;
