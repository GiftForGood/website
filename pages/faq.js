import React from 'react';
import dynamic from 'next/dynamic';

// components
import SessionProvider from '@components/session/modules/SessionProvider';
import { isAuthenticated } from '@utils/authentication/authentication';
import Header from '@components/header';
import Faq from '@pages/faq/pages';

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

const FaqPage = ({ user }) => {
  return (
    <SessionProvider user={user}>
      <Header title="FAQ | GiftForGood" />
      <TopNavigationBar showNews={true} />
      <Faq />
      <BottomNavigation />
      <Footer />
    </SessionProvider>
  );
};

export default FaqPage;
