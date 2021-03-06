import React from 'react';
import dynamic from 'next/dynamic';

// components
import DonationPage from '@pages/donationDetail';
import SessionProvider from '@components/session/modules/SessionProvider';
import Head from 'next/head';
import Header from '@components/header';
import Error from 'next/error';

// constants and utils
import api from '@api';
import { isAuthenticated } from '@utils/authentication/authentication';
import { ogImagePath } from '@constants/imagePaths';
import { deserializeFirestoreTimestampToUnixTimestamp } from '@utils/firebase/deserializer';

// hooks
import { useRouter } from 'next/router';

// dynamic imports
const TopNavigationBar = dynamic(() => import('@components/navbar/modules/TopNavigationBar'), {
  ssr: false,
});
const Footer = dynamic(() => import('@components/footer/Footer'), { ssr: false });

export async function getServerSideProps({ params, req, res, query }) {
  const donationId = params.donationId;
  const prevHref = query.categoryId ? `/donations/category/${query.categoryId}` : `/donations/category`;
  const categoryName = query.categoryName ? query.categoryName : 'All donations';
  let donorDetails = {};
  const [donationDetails, user] = await Promise.all([getDonationDetails(donationId), isAuthenticated(req, res)]);
  if (Object.keys(donationDetails).length !== 0) {
    donorDetails = await getDonorDetails(donationDetails.user.userId);
  }
  deserializeFirestoreTimestampToUnixTimestamp(donorDetails, donationDetails);
  return {
    props: {
      donationId,
      donationDetails,
      donorDetails,
      user,
      prevHref,
      categoryName,
    },
  };
}

const getDonationDetails = async (donationId) => {
  const rawDonation = await api.donations.get(donationId).catch((err) => console.error(err));
  return rawDonation.data() ? rawDonation.data() : {};
};

const getDonorDetails = async (donorId) => {
  const rawNpo = await api.users.getDonor(donorId).catch((err) => console.error(err));
  return rawNpo.data();
};

const Donation = ({ donationId, donationDetails, donorDetails, user, prevHref, categoryName }) => {
  const router = useRouter();
  if (donationDetails === undefined || Object.keys(donationDetails).length === 0) {
    return <Error statusCode={404} />;
  }

  return (
    <SessionProvider user={user}>
      <Header title={donationDetails.title} />
      <Head>
        {/* meta property for sharing purposes */}
        <meta property="og:url" content={`https://www.giftforgood.io${router.asPath}`} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="GiftForGood" />
        <meta property="og:description" content="Check out this donation from GiftForGood!" />
        <meta property="og:image" content={ogImagePath} />
        <meta property="og:image:secure_url" content={ogImagePath} />
        <meta property="og:image:type" content="image/jpeg" />
      </Head>
      <TopNavigationBar showNews={true} />
      <DonationPage
        donationId={donationId}
        donationDetails={donationDetails}
        donorDetails={donorDetails}
        user={user}
        prevHref={prevHref}
        categoryName={categoryName}
      />
      <Footer />
    </SessionProvider>
  );
};

export default Donation;
