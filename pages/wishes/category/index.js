import React from 'react';
import ViewAllWishesPage from '../../../src/components/category/pages/ViewAllWishesPage';
import dynamic from 'next/dynamic';
import SessionProvider from '../../../src/components/session/modules/SessionProvider';
import { isAuthenticated } from '../../../utils/authentication/authentication';
import Footer from '../../../src/components/footer/Footer';
import Header from '../../../src/components/header';

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
      query: query.q ? query.q : '',
      user,
    },
  };
}

const ViewAllWishes = ({ sortByQuery, user, query }) => {
  return (
    <SessionProvider user={user}>
      <Header title={`All | Wishes`} />
      <TopNavigationBar showNews={true} />
      <ViewAllWishesPage sortByQuery={sortByQuery} query={query} />
      <BottomNavigation />
      <Footer />
    </SessionProvider>
  );
};

export default ViewAllWishes;
