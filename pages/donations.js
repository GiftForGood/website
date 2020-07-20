import React from 'react';
import DonationsHomePage from '../src/components/home/pages/DonationsHomePage';
import SessionProvider from '../src/components/session/modules/SessionProvider';
import useUser from '../src/components/session/modules/useUser';
import { isAuthenticated } from '../utils/authentication/authentication';
import Footer from '../src/components/footer/Footer';
import dynamic from 'next/dynamic';
import Header from '../src/components/header';
const TopNavigationBar = dynamic(() => import('../src/components/navbar/modules/TopNavigationBar'), { ssr: false });
const BottomNavigation = dynamic(() => import('../src/components/navbar/modules/BottomNavigation'), { ssr: false });

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
      <TopNavigationBar />
      <DonationsHomePage />
      <BottomNavigation />
      <Footer />
    </SessionProvider>
  );
};

export default DonationsHome;
