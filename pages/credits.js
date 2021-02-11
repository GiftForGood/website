import React from 'react';
import SessionProvider from '@components/session/modules/SessionProvider';
import { isAuthenticated } from '../utils/authentication/authentication';
import CreditsPage from '@pages/credits';
import dynamic from 'next/dynamic';
import Header from '@components/header';
import { WISHES } from '@constants/search';

const TopNavigationBar = dynamic(() => import('../src/components/navbar/modules/TopNavigationBar'), { ssr: false });
const BottomNavigation = dynamic(() => import('../src/components/navbar/modules/BottomNavigation'), { ssr: false });
const Footer = dynamic(() => import('../src/components/footer/Footer'), { ssr: false });

export async function getServerSideProps({ params, req, res, query }) {
  let user = await isAuthenticated(req, res);
  return {
    props: {
      user,
    },
  };
}

const Credits = ({ user }) => {
  return (
    <SessionProvider user={user}>
      <Header title="Credits | GiftForGood" />
      <TopNavigationBar showNews={true} searchDefaultIndex={WISHES} />
      <CreditsPage />
      <BottomNavigation />
      <Footer />
    </SessionProvider>
  );
};

export default Credits;
