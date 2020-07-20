import React from 'react';
import { isAuthenticated } from '../../utils/authentication/authentication';
import { isVerified } from '../../utils/authentication/verification';
import { isNpo } from '../../utils/authentication/userType';
import SessionProvider from '../../src/components/session/modules/SessionProvider';
import CreateWishPage from '../../src/components/createWish/pages/createWishPage';
import Footer from '../../src/components/footer/Footer';
import dynamic from 'next/dynamic';
import Header from '../../src/components/header';

const TopNavigationBar = dynamic(() => import('../../src/components/navbar/modules/TopNavigationBar'), { ssr: false });

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
      <Header title="Create Wishes | GiftForGood"/>
      <TopNavigationBar />
      <CreateWishPage mode="create" />
      <Footer />
    </SessionProvider>
  );
};

export default CreateWishes;
