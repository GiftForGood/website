import React from 'react';
import dynamic from 'next/dynamic';

// utils and constants
import { isAuthenticated } from '@utils/authentication/authentication';
import { isVerified } from '@utils/authentication/verification';
import { isDonor } from '@utils/authentication/userType';

// components
import SessionProvider from '@components/session/modules/SessionProvider';
import CreateDonationPage from '@pages/createDonation';
import Header from '@components/header';

// dynamic imports
const TopNavigationBar = dynamic(() => import('@components/navbar/modules/TopNavigationBar'), { ssr: false });
const Footer = dynamic(() => import('@components/footer/Footer'), { ssr: false });

export async function getServerSideProps({ params, req, res, query }) {
  let user = await isAuthenticated(req, res);
  if (!user) {
    res.writeHead(302, { Location: '/' });
    res.end();
  }
  isVerified(user.user, res, { Location: '/' });
  isDonor(user.user, res, { Location: '/' });
  return {
    props: {
      user,
    },
  };
}

const CreateDonations = ({ user }) => {
  return (
    <SessionProvider user={user}>
      <Header title="Create Donations | GiftForGood" />
      <TopNavigationBar showNews={true} />
      <CreateDonationPage mode="create" />
      <Footer />
    </SessionProvider>
  );
};

export default CreateDonations;
