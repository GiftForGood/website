import React from 'react';
import dynamic from 'next/dynamic';

// components
import NpoProfilePage from '@pages/profile/npo';
import DonorProfilePage from '@pages/profile/donor';
import SessionProvider from '@components/session/modules/SessionProvider';
import Error from 'next/error';

// constants and utils
import { isAuthenticated } from '@utils/authentication/authentication';
import api from '@api';
import { containsNPO, containsDonor } from '@utils/authentication/userType';

// dynamic imports
const TopNavigationBar = dynamic(() => import('@components/navbar/modules/TopNavigationBar'), {
  ssr: false,
});
const BottomNavigation = dynamic(() => import('@components/navbar/modules/BottomNavigation'), {
  ssr: false,
});
const Footer = dynamic(() => import('@components/footer/Footer'), { ssr: false });

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
      <TopNavigationBar showNews={true} />
      {userTypes ? null : <Error statusCode={404} />}
      {containsNPO(userTypes) ? (
        <NpoProfilePage userId={userId} />
      ) : containsDonor(userTypes) ? (
        <DonorProfilePage userId={userId} />
      ) : null}
      <BottomNavigation />
      <Footer />
    </SessionProvider>
  );
};

export default Profile;
