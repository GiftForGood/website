import React from 'react';
import { isAuthenticated } from '@utils/authentication/authentication';
import { isVerified } from '@utils/authentication/verification';
import { isDonor } from '@utils/authentication/userType';
import SessionProvider from '@components/session/modules/SessionProvider';
import CreateDonationPage from '@pages/createDonation';
import dynamic from 'next/dynamic';
import api from '@api';
import Error from 'next/error';
import Header from '@components/header';
import { deserializeFirestoreTimestampToUnixTimestamp } from '@utils/firebase/deserializer';

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
  deserializeFirestoreTimestampToUnixTimestamp(donation);
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
      <Header title="Edit Donations | GiftForGood" />
      <TopNavigationBar showNews={true} />
      {donation ? null : <Error statusCode={404} />}
      {isMine ? null : <Error statusCode={404} />}
      {donation && isMine && <CreateDonationPage donation={donation} mode="edit" />}
      <Footer />
    </SessionProvider>
  );
};

export default CreateWishes;
