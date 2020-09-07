import React from 'react';
import DonationsHomePage from '@components/home/pages/DonationsHomePage';
import SessionProvider from '@components/session/modules/SessionProvider';
import useUser from '@components/session/modules/useUser';
import { isAuthenticated } from '@utils/authentication/authentication';
import dynamic from 'next/dynamic';
import Header from '@components/header';
import { DONATIONS } from '@constants/search';

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
