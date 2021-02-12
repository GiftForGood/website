import React from 'react';
import dynamic from 'next/dynamic';

// components
import CreateWishPage from '@pages/createWish';
import Header from '@components/header';
import Error from 'next/error';
import SessionProvider from '@components/session/modules/SessionProvider';

// constants and utils
import { deserializeFirestoreTimestampToUnixTimestamp } from '@utils/firebase/deserializer';
import { isAuthenticated } from '@utils/authentication/authentication';
import { isVerified } from '@utils/authentication/verification';
import { isNpo } from '@utils/authentication/userType';
import api from '@api';

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
  isNpo(user.user, res, { Location: '/' });

  // duplicate wish
  const wishId = query.wishId ? query.wishId : null;
  let wish = null;
  if (wishId) {
    const wishDoc = await api.wishes.get(wishId).catch((err) => console.error(err));

    if (!wishDoc.exists) {
      return {
        props: {
          hasError: true,
        },
      };
    }

    // duplicate wish, but not the post owner
    if (wishDoc.data().user.userId !== user.user.userId) {
      return {
        props: {
          hasError: true,
        },
      };
    }

    wish = wishDoc.data();
    deserializeFirestoreTimestampToUnixTimestamp(wish);
  }

  return {
    props: {
      user,
      wish,
    },
  };
}

const CreateWishes = ({ user, wish, hasError }) => {
  if (hasError) {
    return <Error />;
  }
  return (
    <SessionProvider user={user}>
      <Header title="Create Wishes | GiftForGood" />
      <TopNavigationBar showNews={true} />
      <CreateWishPage mode="create" wish={wish} />
      <Footer />
    </SessionProvider>
  );
};

export default CreateWishes;
