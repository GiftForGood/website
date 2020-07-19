import React from 'react';
import { isAuthenticated } from '../../utils/authentication/authentication';
import { isVerified } from '../../utils/authentication/verification';
import { isDonor } from '../../utils/authentication/userType';
import SessionProvider from '../../src/components/session/modules/SessionProvider';
import CreateDonationPage from '../../src/components/createDonation/pages/createDonationPage';
import dynamic from 'next/dynamic';
import api from '../../utils/api';
import Error from 'next/error';
import Footer from '../../src/components/footer/Footer';

const TopNavigationBar = dynamic(() => import('../../src/components/navbar/modules/TopNavigationBar'), { ssr: false });

export async function getServerSideProps({ params, req, res, query }) {
  let user = await isAuthenticated(req, res);
  if (!user) {
    res.writeHead(302, { Location: '/' });
    res.end();
  }
  isVerified(user.user, res, { Location: '/' });
  isDonor(user.user, res, { Location: '/' });
  const donationId = query.id;
  const donationDoc = await api.donations.get(donationId);
  let donation = null;
  let isMine = false;
  if (donationDoc.exists) {
    donation = donationDoc.data();
  }
  if (user && donation && user.user.userId === donation.user.userId) {
    // checks if the wish is mine.
    isMine = true;
  }
  return {
    props: {
      user,
      donation,
      isMine,
    },
  };
}

const CreateWishes = ({ user, donation, isMine }) => {
  return (
    <SessionProvider user={user}>
      <TopNavigationBar />
      {donation ? null : <Error statusCode={404} />}
      {isMine ? null : <Error statusCode={404} />}
      {donation && isMine && <CreateDonationPage donation={donation} mode="edit" />}
      <Footer />
    </SessionProvider>
  );
};

export default CreateWishes;
