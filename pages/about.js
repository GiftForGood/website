import React from 'react';
import SessionProvider from '../src/components/session/modules/SessionProvider';
import { isAuthenticated } from '../utils/authentication/authentication';
import AboutUsPage from '../src/components/aboutUs/pages/AboutUsPage';
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

const AboutUs = ({ user }) => {
  return (
    <SessionProvider user={user}>
      <Header title="About Us | GiftForGood" />
      <TopNavigationBar showNews={true} searchDefaultIndex={WISHES} />
      <AboutUsPage />
      <BottomNavigation />
      <Footer />
    </SessionProvider>
  );
};

export default AboutUs;
