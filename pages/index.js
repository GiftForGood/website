import React from 'react';
import dynamic from 'next/dynamic';

// components
import WishesHomePage from '@pages/home/wishes';
import Header from '@components/header';
import SessionProvider from '@components/session/modules/SessionProvider';
import Onboarding from '@components/onboarding/Onboarding';

// constants and utils
import { isAuthenticated } from '@utils/authentication/authentication';
import { WISHES } from '@constants/search';
import { DONOR, NPO } from '@constants/usersType';

// dynamic imports
const TopNavigationBar = dynamic(() => import('@components/navbar/modules/TopNavigationBar'), { ssr: false });
const BottomNavigation = dynamic(() => import('@components/navbar/modules/BottomNavigation'), { ssr: false });
const Footer = dynamic(() => import('@components/footer/Footer'), { ssr: false });

export async function getServerSideProps({ params, req, res, query }) {
  let user = await isAuthenticated(req, res);
  const { next } = query;
  return {
    props: {
      user,
      next: next || null,
    },
  };
}

const WishesHome = ({ user, next }) => {
  return (
    <SessionProvider user={user}>
      <Header title="Gift for Good | Donations in-kind Singapore" />
      <TopNavigationBar showNews={true} searchDefaultIndex={WISHES} />
      <WishesHomePage />
      <BottomNavigation />
      <Footer />

      <Onboarding
        show={user && next === 'onboarding' ? true : false}
        type={user?.user?.donor ? DONOR : NPO}
        name={user?.user?.name}
      />
    </SessionProvider>
  );
};

export default WishesHome;
