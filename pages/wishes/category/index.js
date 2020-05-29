import React from 'react';
import ViewAllWishesPage from '../../../src/components/category/pages/ViewAllWishesPage';
import dynamic from 'next/dynamic';
import SessionProvider from '../../../src/components/session/modules/SessionProvider';
import { isAuthenticated } from '../../../utils/authentication/authentication';
const TopNavigationBar = dynamic(() => import('../../../src/components/navbar/modules/TopNavigationBar'), {
  ssr: false,
});

export async function getServerSideProps({ query, req, res }) {
  let user = await isAuthenticated(req, res);
  return {
    props: {
      filterQuery: query.filter ? query.filter : null,
      user,
    },
  };
}

const ViewAllWishes = ({ filterQuery, user }) => {
  return (
    <SessionProvider user={user}>
      <TopNavigationBar />
      <ViewAllWishesPage filterQuery={filterQuery} />
    </SessionProvider>
  );
};

export default ViewAllWishes;
