import React from 'react';
import SessionProvider from '@components/session/modules/SessionProvider';
import { isAuthenticated } from '@utils/authentication/authentication';
import AboutUsPage from '@pages/aboutUs';
import dynamic from 'next/dynamic';
import Header from '@components/header';
import { WISHES } from '@constants/search';

const TopNavigationBar = dynamic(() => import('../src/components/navbar/modules/TopNavigationBar'), { ssr: false });
const BottomNavigation = dynamic(() => import('../src/components/navbar/modules/BottomNavigation'), { ssr: false });
const MobileFooter = dynamic(() => import('@components/footer/MobileFooter'), { ssr: false });
const Footer = dynamic(() => import('@components/footer/Footer'), { ssr: false });

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
      <MobileFooter />
      <BottomNavigation />
      <Footer />
    </SessionProvider>
  );
};

export default AboutUs;
