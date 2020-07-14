import React from 'react';
import ViewAllWishesPage from '../../../src/components/category/pages/ViewAllWishesPage';
import dynamic from 'next/dynamic';
import SessionProvider from '../../../src/components/session/modules/SessionProvider';
import { isAuthenticated } from '../../../utils/authentication/authentication';
const TopNavigationBar = dynamic(() => import('../../../src/components/navbar/modules/TopNavigationBar'), {
  ssr: false,
});
const BottomNavigation = dynamic(() => import('../../../src/components/navbar/modules/BottomNavigation'), {
  ssr: false,
});

export async function getServerSideProps({ query, req, res }) {
  let user = await isAuthenticated(req, res);
  return {
    props: {
      sortByQuery: query.sortBy ? query.sortBy : null,
      user,
    },
  };
}

const ViewAllWishes = ({ sortByQuery, user }) => {
  return (
    <SessionProvider user={user}>
      <TopNavigationBar />
      <ViewAllWishesPage sortByQuery={sortByQuery} />
      <BottomNavigation />
    </SessionProvider>
  );
};

export default ViewAllWishes;
