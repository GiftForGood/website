import React from 'react';
import { isAuthenticated } from '@utils/authentication/authentication';
import { isVerified } from '@utils/authentication/verification';
import { isNpo } from '@utils/authentication/userType';
import SessionProvider from '../../src/components/session/modules/SessionProvider';
import CreateWishPage from '../../src/components/createWish/pages/createWishPage';
import dynamic from 'next/dynamic';
import api from '@api';
import Error from 'next/error';
import Header from '../../src/components/header';

const TopNavigationBar = dynamic(() => import('../../src/components/navbar/modules/TopNavigationBar'), { ssr: false });
const Footer = dynamic(() => import('../../src/components/footer/Footer'), { ssr: false });

export async function getServerSideProps({ params, req, res, query }) {
  let user = await isAuthenticated(req, res);
  if (!user) {
    res.writeHead(302, { Location: '/' });
    res.end();
  }
  isVerified(user.user, res, { Location: '/' });
  isNpo(user.user, res, { Location: '/' });
  const wishId = query.id;
  const wishDoc = await api.wishes.get(wishId);
  let wish = null;
  let isMine = false;
  if (wishDoc.exists) {
    wish = wishDoc.data();
  }
  if (user && wish && user.user.userId === wish.user.userId) {
    // checks if the wish is mine.
    isMine = true;
  }
  return {
    props: {
      user,
      wish,
      isMine,
    },
  };
}

const CreateWishes = ({ user, wish, isMine }) => {
  return (
    <SessionProvider user={user}>
      <Header title="Edit Wishes | GiftForGood" />

      <TopNavigationBar showNews={true} />
      {wish ? null : <Error statusCode={404} />}
      {isMine ? null : <Error statusCode={404} />}
      {wish && isMine && <CreateWishPage wish={wish} mode="edit" />}
      <Footer />
    </SessionProvider>
  );
};

export default CreateWishes;
