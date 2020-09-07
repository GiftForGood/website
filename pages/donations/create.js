import React from 'react';
import { isAuthenticated } from '@utils/authentication/authentication';
import { isVerified } from '@utils/authentication/verification';
import { isDonor } from '@utils/authentication/userType';
import SessionProvider from '@components/session/modules/SessionProvider';
import CreateDonationPage from '@components/createDonation/pages/createDonationPage';
import dynamic from 'next/dynamic';
import Header from '@components/header';

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
