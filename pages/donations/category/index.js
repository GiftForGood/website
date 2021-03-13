import React from 'react';
import ViewAllDonationsPage from '@pages/category/donations/all';
import dynamic from 'next/dynamic';
import SessionProvider from '@components/session/modules/SessionProvider';
import { isAuthenticated } from '@utils/authentication/authentication';
import Header from '@components/header';
import { DONATIONS } from '@constants/search';

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

const ViewAllDonations = ({ sortByQuery, user, query }) => {
  return (
    <SessionProvider user={user}>
      <Header title={`All | Donations`} />
      <TopNavigationBar showNews={true} searchDefaultIndex={DONATIONS} />
      <ViewAllDonationsPage sortByQuery={sortByQuery} query={query} />
      <BottomNavigation />
      <Footer />
    </SessionProvider>
  );
};

export default ViewAllDonations;
