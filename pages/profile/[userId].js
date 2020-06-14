import React from 'react';
import dynamic from 'next/dynamic';
import NpoProfilePage from '../../src/components/profile/pages/NpoProfilePage';
import SessionProvider from '../../src/components/session/modules/SessionProvider';
import { isAuthenticated } from '../../utils/authentication/authentication';
import api from '../../utils/api';
import { containsNPO, containsDonor } from '../../utils/authentication/userType';
import Error from 'next/error';
import DonorProfilePage from '../../src/components/profile/pages/DonorProfilePage';
const TopNavigationBar = dynamic(() => import('../../src/components/navbar/modules/TopNavigationBar'), {
  ssr: false,
});
const BottomNavigation = dynamic(() => import('../../src/components/navbar/modules/BottomNavigation'), {
  ssr: false,
});

export async function getServerSideProps({ params, req, res, query }) {
  let userId = params.userId;
  const [user, userTypes] = await Promise.all([isAuthenticated(req, res), api.users.getUserType(params.userId)]);
  return {
    props: {
      user,
      userId,
      userTypes: userTypes.exists ? userTypes.data() : null,
    },
  };
}

const Profile = ({ user, userId, userTypes }) => {
  return (
    <SessionProvider user={user}>
      <TopNavigationBar />
      {userTypes ? null : <Error statusCode={404} />}
      {containsNPO(userTypes) ? (
        <NpoProfilePage userId={userId} />
      ) : containsDonor(userTypes) ? (
        <DonorProfilePage userId={userId} />
      ) : null}
      <BottomNavigation />
    </SessionProvider>
  );
};

export default Profile;
