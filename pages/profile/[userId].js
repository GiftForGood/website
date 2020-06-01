import React from 'react';
import dynamic from 'next/dynamic';
import NpoProfilePage from '../../src/components/profile/pages/NpoProfilePage';
import SessionProvider from '../../src/components/session/modules/SessionProvider';
import { isAuthenticated } from '../../utils/authentication/authentication';
import api from '../../utils/api';
import { containsNPO } from '../../utils/authentication/userType';
import Error from 'next/error';
const TopNavigationBar = dynamic(() => import('../../src/components/navbar/modules/TopNavigationBar'), {
  ssr: false,
});

export async function getServerSideProps({ params, req, res, query }) {
  let user = await isAuthenticated(req, res);
  let userId = params.userId;
  let userTypes = await api.users.getUserType(userId);
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
      {containsNPO(userTypes) ? <NpoProfilePage userId={userId} /> : null}
    </SessionProvider>
  );
};

export default Profile;
