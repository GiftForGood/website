import React from 'react';
import dynamic from 'next/dynamic';

// components
import DonationsHomePage from '@pages/home/donations';
import SessionProvider from '@components/session/modules/SessionProvider';
import Header from '@components/header';

// hooks
import useUser from '@components/session/modules/useUser';

// constants and utils
import { isAuthenticated } from '@utils/authentication/authentication';
import { DONATIONS } from '@constants/search';

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

const DonationsHome = ({ user }) => {
  const userData = useUser();
  return (
    <SessionProvider user={user}>
      <Header title="Donations | GiftForGood" />
      <TopNavigationBar showNews={true} searchDefaultIndex={DONATIONS} />
      <DonationsHomePage />
      <BottomNavigation />
      <Footer />
    </SessionProvider>
  );
};

export default DonationsHome;
