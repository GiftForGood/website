import React from 'react';
import dynamic from 'next/dynamic';

// components
import SessionProvider from '@components/session/modules/SessionProvider';
import CreditsPage from '@pages/credits';
import Header from '@components/header';

// constants and utils
import { WISHES } from '@constants/search';
import { isAuthenticated } from '../utils/authentication/authentication';

// dynamic imports
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
