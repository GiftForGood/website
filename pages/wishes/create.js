import React from 'react';
import { isAuthenticated } from '../../utils/authentication/authentication';
import { isVerified } from '../../utils/authentication/verification';
import SessionProvider from '../../src/components/session/modules/SessionProvider';
import CreateWishPage from '../../src/components/createWish/pages/createWishPage';

import dynamic from 'next/dynamic';
const TopNavigationBar = dynamic(() => import('../../src/components/navbar/modules/TopNavigationBar'), { ssr: false });

export async function getServerSideProps({ params, req, res, query }) {
  let user = await isAuthenticated(req, res);
  isVerified(user, res, { Location: '/' });
  if (user) {
    res.writeHead(302, { Location: '/' });
    res.end();
  }
  return {
    props: {
      user,
    },
  };
}

const CreateWishes = ({ user }) => {
  return (
    <SessionProvider user={user}>
      <TopNavigationBar />
      <CreateWishPage />
    </SessionProvider>
  );
};

export default CreateWishes;
