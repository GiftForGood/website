import React from 'react';
import dynamic from 'next/dynamic';

// components
import WishHeader from '@components/header/WishHeader';
import Header from '@components/header';
import Error from 'next/error';
import SessionProvider from '@components/session/modules/SessionProvider';
import WishDetailPage from '@pages/wishDetail';

// hooks
import { useRouter } from 'next/router';

// constants and utils
import { deserializeFirestoreTimestampToUnixTimestamp } from '@utils/firebase/deserializer';
import { isAuthenticated } from '@utils/authentication/authentication';
import api from '@api';

// dynamic imports
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
  deserializeFirestoreTimestampToUnixTimestamp(wishDetails, npoDetails);
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
      <WishHeader title={wishDetails.title} description={wishDetails.description} path={router.asPath} id={wishId} />
      <TopNavigationBar showNews={true} />
      <WishDetailPage
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
