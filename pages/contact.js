import React from 'react';
import dynamic from 'next/dynamic';

// components
import Header from '@components/header';
import SessionProvider from '@components/session/modules/SessionProvider';
import ContactUsPage from '@pages/contactUs';

// constants and utils
import { WISHES } from '@constants/search';
import { isAuthenticated } from '@utils/authentication/authentication';

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

const ContactUs = ({ user }) => {
  return (
    <SessionProvider user={user}>
      <Header title="Contact Us | GiftForGood" />
      <TopNavigationBar showNews={true} searchDefaultIndex={WISHES} />
      <ContactUsPage />
      <BottomNavigation />
      <Footer />
    </SessionProvider>
  );
};

export default ContactUs;
