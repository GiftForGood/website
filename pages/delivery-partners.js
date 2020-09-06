import React from 'react';
import SessionProvider from '../src/components/session/modules/SessionProvider';
import { isAuthenticated } from '../utils/authentication/authentication';
import DeliveryPartnersPage from '../src/components/deliveryPartners/pages/DeliveryPartnersPage';
import dynamic from 'next/dynamic';
import Header from '../src/components/header';
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

const DeliveryPartners = ({ user }) => {
  return (
    <SessionProvider user={user}>
      <Header title="Delivery Partners | GiftForGood" />
      <TopNavigationBar showNews={true} searchDefaultIndex={WISHES} />
      <DeliveryPartnersPage />
      <BottomNavigation />
      <Footer />
    </SessionProvider>
  );
};

export default DeliveryPartners;
