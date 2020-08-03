import React from 'react';
import ViewAllDonationsPage from '../../../src/components/category/pages/ViewAllDonationsPage';
import dynamic from 'next/dynamic';
import SessionProvider from '../../../src/components/session/modules/SessionProvider';
import { isAuthenticated } from '../../../utils/authentication/authentication';
import Header from '../../../src/components/header';

const TopNavigationBar = dynamic(() => import('../../../src/components/navbar/modules/TopNavigationBar'), {
  ssr: false,
});
const BottomNavigation = dynamic(() => import('../../../src/components/navbar/modules/BottomNavigation'), {
  ssr: false,
});
const Footer = dynamic(() => import('../../../src/components/footer/Footer'), { ssr: false });

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

const ViewAllDonations = ({ sortByQuery, user, query }) => {
  return (
    <SessionProvider user={user}>
      <Header title={`All | Donations`} />
      <TopNavigationBar showNews={true} />
      <ViewAllDonationsPage sortByQuery={sortByQuery} query={query} />
      <BottomNavigation />
      <Footer />
    </SessionProvider>
  );
};

export default ViewAllDonations;
