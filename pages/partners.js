import React from 'react';
import dynamic from 'next/dynamic';

// components
import SessionProvider from '@components/session/modules/SessionProvider';
import PartnersPage from '@pages/partners';
import Header from '@components/header';

// constants and utils
import { isAuthenticated } from '@utils/authentication/authentication';
import { WISHES } from '@utils/constants/search';

// dynamic imports
const TopNavigationBar = dynamic(() => import('@components/navbar/modules/TopNavigationBar'), { ssr: false });
const BottomNavigation = dynamic(() => import('@components/navbar/modules/BottomNavigation'), { ssr: false });
const Footer = dynamic(() => import('@components/footer/Footer'), { ssr: false });

export async function getServerSideProps({ params, req, res, query }) {
  let user = await isAuthenticated(req, res);
  return {
    props: {
      user,
    },
  };
}

const Partners = ({ user }) => {
  return (
    <SessionProvider user={user}>
      <Header title="Partners | GiftForGood" />
      <TopNavigationBar showNews={true} searchDefaultIndex={WISHES} />
      <PartnersPage />
      <BottomNavigation />
      <Footer />
    </SessionProvider>
  );
};

export default Partners;
