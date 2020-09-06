import React from 'react';
import { isAuthenticated } from '@utils/authentication/authentication';
import { isVerified } from '@utils/authentication/verification';
import { isNpo } from '@utils/authentication/userType';
import SessionProvider from '@components/session/modules/SessionProvider';
import CreateWishPage from '@components/createWish/pages/createWishPage';
import dynamic from 'next/dynamic';
import Header from '@components/header';

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
  return {
    props: {
      user,
    },
  };
}

const CreateWishes = ({ user }) => {
  return (
    <SessionProvider user={user}>
      <Header title="Create Wishes | GiftForGood" />
      <TopNavigationBar showNews={true} />
      <CreateWishPage mode="create" />
      <Footer />
    </SessionProvider>
  );
};

export default CreateWishes;
