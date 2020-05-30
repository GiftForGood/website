import React from 'react';
import api from '../../utils/api';
import WishPage from '../../src/components/wishDetail/pages/WishPage';
import dynamic from 'next/dynamic';
import SessionProvider from '../../src/components/session/modules/SessionProvider';
import Head from 'next/head';
import { isAuthenticated } from '../../utils/authentication/authentication';
import Error from 'next/error';
import { companyLogoImagePngPath } from '../../utils/constants/imagePaths';
const TopNavigationBar = dynamic(() => import('../../src/components/navbar/modules/TopNavigationBar'), {
  ssr: false,
});

export async function getServerSideProps({ params, req, res, query }) {
  const wishId = params.wishId;
  const prevHref = query.categoryId ? `/wishes/category/${query.categoryId}` : `/wishes/category`;
  const categoryName = query.categoryName ? query.categoryName : 'All wishes';
  const wishDetails = await getWishDetails(wishId);
  let npoDetails = {}; // TODO remove & uncomment bottom when getNPO API is up
  if (Object.keys(wishDetails).length !== 0) {
    // npoDetails = await getNpoDetails(wishDetails.user.userId);
  }
  let user = await isAuthenticated(req, res);
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
  const rawWish = await api.wishes.getWish(wishId).catch((err) => console.error(err));
  return rawWish.data() ? rawWish.data() : {};
};

const getNpoDetails = async (npoId) => {
  const rawNpo = await api.users.getNPO(npoId).catch((err) => console.error(err));
  return rawNpo.data();
};

const Wish = ({ wishId, wishDetails, npoDetails, user, prevHref, categoryName }) => {
  if (Object.keys(wishDetails).length === 0) {
    return <Error statusCode={404} />;
  }
  return (
    <SessionProvider user={user}>
      <Head>
        {/* meta property for sharing purposes */}
        <meta property="og:url" content={'https://www.giftforgood.io/wishes/' + wishId} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="GiftForGood" />
        <meta property="og:description" content="Check out this wish from GiftForGood!" />
        <meta property="og:image" content={companyLogoImagePngPath} />
        <meta property="og:image:secure_url" content={companyLogoImagePngPath} />
        <meta property="og:image:type" content="image/png" />
      </Head>
      <TopNavigationBar />
      <WishPage
        wishId={wishId}
        wishDetails={wishDetails}
        npoDetails={npoDetails}
        user={user}
        prevHref={prevHref}
        categoryName={categoryName}
      />
    </SessionProvider>
  );
};

export default Wish;