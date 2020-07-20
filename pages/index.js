import React from 'react';
import SessionProvider from '../src/components/session/modules/SessionProvider';
import useUser from '../src/components/session/modules/useUser';
import { isAuthenticated } from '../utils/authentication/authentication';
import Verified from '../src/components/session/modules/Verified';
import WishesHomePage from '../src/components/home/pages/WishesHomePage';
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

const WishesHome = ({ user }) => {
  const userData = useUser();
  return (
    <SessionProvider user={user}>
      <Header title="Wishes | GiftForGood" />
      <TopNavigationBar />
      <WishesHomePage />
      <BottomNavigation />
      <Footer />
    </SessionProvider>
  );
};

export default WishesHome;
