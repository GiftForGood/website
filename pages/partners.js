import React from 'react';
import SessionProvider from '../src/components/session/modules/SessionProvider';
import { isAuthenticated } from '../utils/authentication/authentication';
import PartnersPage from '../src/components/partners/pages/PartnersPage';
import dynamic from 'next/dynamic';
import Header from '../src/components/header';
import { WISHES } from '../utils/constants/search';

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
