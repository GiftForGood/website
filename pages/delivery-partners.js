import React from 'react';
import SessionProvider from '@components/session/modules/SessionProvider';
import { isAuthenticated } from '@utils/authentication/authentication';
import DeliveryPartnersPage from '@components/deliveryPartners/pages/DeliveryPartnersPage';
import dynamic from 'next/dynamic';
import Header from '@components/header';
import { WISHES } from '@constants/search';

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
