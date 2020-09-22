import React from 'react';
import SessionProvider from '@components/session/modules/SessionProvider';
import { isAuthenticated } from '@utils/authentication/authentication';
import dynamic from 'next/dynamic';
import Header from '@components/header';
import { NPOS } from '@constants/search';
import NposPage from '@components/npos/pages/NposPage';

const TopNavigationBar = dynamic(() => import('@components/navbar/modules/TopNavigationBar'), { ssr: false });
const BottomNavigation = dynamic(() => import('@components/navbar/modules/BottomNavigation'), { ssr: false });
const Footer = dynamic(() => import('@components/footer/Footer'), { ssr: false });

export async function getServerSideProps({ params, req, res, query }) {
  let user = await isAuthenticated(req, res);
  return {
    props: {
      sortByQuery: query.sortBy ? query.sortBy : null,
      query: query.q ? query.q : '',
      user,
    },
  };
}

const Npos = ({ sortByQuery, user, query }) => {
  return (
    <SessionProvider user={user}>
      <Header title="NPOs | GiftForGood" />
      <TopNavigationBar showNews={true} searchDefaultIndex={NPOS} />
      <NposPage sortByQuery={sortByQuery} query={query} />
      <BottomNavigation />
      <Footer />
    </SessionProvider>
  );
};

export default Npos;
