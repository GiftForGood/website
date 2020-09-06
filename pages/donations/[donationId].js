import React from 'react';
import api from '@api';
import DonationPage from '../../src/components/donationDetail/pages/DonationPage';
import dynamic from 'next/dynamic';
import SessionProvider from '../../src/components/session/modules/SessionProvider';
import Head from 'next/head';
import { isAuthenticated } from '../../utils/authentication/authentication';
import Error from 'next/error';
import { ogImagePath } from '@constants/imagePaths';
import { useRouter } from 'next/router';
import Header from '../../src/components/header';
const TopNavigationBar = dynamic(() => import('../../src/components/navbar/modules/TopNavigationBar'), {
  ssr: false,
});
const Footer = dynamic(() => import('../../src/components/footer/Footer'), { ssr: false });

export async function getServerSideProps({ params, req, res, query }) {
  const donationId = params.donationId;
  const prevHref = query.categoryId ? `/donations/category/${query.categoryId}` : `/donations/category`;
  const categoryName = query.categoryName ? query.categoryName : 'All donations';
  let donorDetails = {};
  const [donationDetails, user] = await Promise.all([getDonationDetails(donationId), isAuthenticated(req, res)]);
  if (Object.keys(donationDetails).length !== 0) {
    donorDetails = await getDonorDetails(donationDetails.user.userId);
  }
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
