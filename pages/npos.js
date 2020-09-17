import React from 'react';
import SessionProvider from '@components/session/modules/SessionProvider';
import useUser from '@components/session/modules/useUser';
import { isAuthenticated } from '@utils/authentication/authentication';
import Verified from '@components/session/modules/Verified';
import WishesHomePage from '@components/home/pages/WishesHomePage';
import dynamic from 'next/dynamic';
import Header from '@components/header';
import { WISHES } from '@constants/search';
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
      <Header title="Npos | GiftForGood" />
      <TopNavigationBar showNews={true} searchDefaultIndex={WISHES} />
      <NposPage sortByQuery={sortByQuery} query={query} />
      <BottomNavigation />
      <Footer />
    </SessionProvider>
  );
};

export default Npos;
