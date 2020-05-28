import React from 'react';
import dynamic from 'next/dynamic';
import NpoProfilePage from '../../../src/components/profile/pages/NpoProfilePage';
import SessionProvider from '../../../src/components/session/modules/SessionProvider';
import { isAuthenticated } from '../../../utils/authentication/authentication';
const TopNavigationBar = dynamic(() => import('../../../src/components/navbar/modules/TopNavigationBar'), {
  ssr: false,
});

export async function getServerSideProps({ params, req, res, query }) {
  let user = await isAuthenticated(req, res);
  return {
    props: {
      user,
    },
  };
}

const Profile = ({ user }) => {
  return (
    <SessionProvider user={user}>
      <TopNavigationBar />
      <NpoProfilePage user={user} />
    </SessionProvider>
  );
};

export default Profile;
