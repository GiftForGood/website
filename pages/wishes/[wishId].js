import React from 'react';
import api from '../../utils/api';
import WishPage from '../../src/components/wishDetail/pages/WishPage';
import dynamic from 'next/dynamic';
import SessionProvider from '../../src/components/session/modules/SessionProvider';
import Head from 'next/head';
import { isAuthenticated } from '../../utils/authentication/authentication';
const TopNavigationBar = dynamic(() => import('../../src/components/navbar/modules/TopNavigationBar'), {
  ssr: false,
});

export async function getServerSideProps({ params, req, res, query }) {
  const wishDetails = await getWishDetails(params.wishId);
  const npoDetails = {}; // TODO remove & uncomment bottom when getNPO API is up
  // const npoDetails = await getNpoDetails(wishDetails.user.userId);
  let user = await isAuthenticated(req, res);
  return {
    props: {
      wishDetails,
      npoDetails,
      user,
    },
  };
}

const getWishDetails = async (wishId) => {
  const rawWish = await api.wishes.getWish(wishId).catch((err) => console.error(err));
  return rawWish.docs[0].data();
};

const getNpoDetails = async (npoId) => {
  const rawNpo = await api.users.getNPO(npoId).catch((err) => console.error(err));
  return rawNpo.docs[0].data();
};

const Wish = ({ wishDetails, npoDetails, user }) => {
  return (
    <SessionProvider user={user}>
      <Head>
        {/* meta property for Facebook sharing purposes */}
        <meta property="og:url" content={'https://www.giftforgood.io/wishes/' + wishDetails.wishesId} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="GiftForGood" />
        <meta property="og:description" content="Check out this wish from GiftForGood!" />
        {/* og:image is used for testing purposes, will remove or be replaced */}
        <meta
          property="og:image"
          content="https://i.kinja-img.com/gawker-media/image/upload/c_scale,f_auto,fl_progressive,q_80,w_800/1877zq2agxex9jpg.jpg"
        />
      </Head>
      <TopNavigationBar />
      <WishPage wishDetails={wishDetails} npoDetails={npoDetails} user={user} />
    </SessionProvider>
  );
};

export default Wish;
