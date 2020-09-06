import React from 'react';
import api from '@api';
import WishPage from '@components/wishDetail/pages/WishPage';
import dynamic from 'next/dynamic';
import SessionProvider from '@components/session/modules/SessionProvider';
import Head from 'next/head';
import { isAuthenticated } from '@utils/authentication/authentication';
import Error from 'next/error';
import { ogImagePath } from '@constants/imagePaths';
import { useRouter } from 'next/router';
import Header from '@components/header';
const TopNavigationBar = dynamic(() => import('@components/navbar/modules/TopNavigationBar'), {
  ssr: false,
});
const Footer = dynamic(() => import('@components/footer/Footer'), { ssr: false });

export async function getServerSideProps({ params, req, res, query }) {
  const wishId = params.wishId;
  const prevHref = query.categoryId ? `/wishes/category/${query.categoryId}` : `/wishes/category`;
  const categoryName = query.categoryName ? query.categoryName : 'All wishes';
  let npoDetails = {};
  const [wishDetails, user] = await Promise.all([getWishDetails(wishId), isAuthenticated(req, res)]);
  if (Object.keys(wishDetails).length !== 0) {
    npoDetails = await getNpoDetails(wishDetails.user.userId);
  }
  return {
    props: {
      wishId,
      wishDetails,
      npoDetails,
      user,
      prevHref,
      categoryName,
    },
  };
}

const getWishDetails = async (wishId) => {
  const rawWish = await api.wishes.get(wishId).catch((err) => console.error(err));
  return rawWish.data() ? rawWish.data() : {};
};

const getNpoDetails = async (npoId) => {
  const rawNpo = await api.users.getNPO(npoId).catch((err) => console.error(err));
  return rawNpo.data();
};

const Wish = ({ wishId, wishDetails, npoDetails, user, prevHref, categoryName }) => {
  const router = useRouter();
  if (wishDetails === undefined || Object.keys(wishDetails).length === 0) {
    return <Error statusCode={404} />;
  }
  return (
    <SessionProvider user={user}>
      <Header title={wishDetails.title} />
      <Head>
        {/* meta property for sharing purposes */}
        <meta property="og:url" content={`https://www.giftforgood.io${router.asPath}`} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="GiftForGood" />
        <meta property="og:description" content="Check out this wish from GiftForGood!" />
        <meta property="og:image" content={ogImagePath} />
        <meta property="og:image:secure_url" content={ogImagePath} />
        <meta property="og:image:type" content="image/jpeg" />
      </Head>
      <TopNavigationBar showNews={true} />
      <WishPage
        wishId={wishId}
        wishDetails={wishDetails}
        npoDetails={npoDetails}
        user={user}
        prevHref={prevHref}
        categoryName={categoryName}
      />
      <Footer />
    </SessionProvider>
  );
};

export default Wish;
