import React from 'react';
import SessionProvider from '../../src/components/session/modules/SessionProvider';
import { isAuthenticated } from '../../utils/authentication/authentication';
import dynamic from 'next/dynamic';
import NpoSettingProfilePage from '../../src/components/settings-profile/npo/pages/NpoSettingProfilePage';

const TopNavigationBar = dynamic(() => import('../../src/components/navbar/modules/TopNavigationBar'), { ssr: false });

export async function getServerSideProps({ params, req, res, query }) {
  let user = await isAuthenticated(req, res);
  if (!user) {
    res.writeHead(302, { Location: '/' });
    res.end();
  }
  return {
    props: {
      user,
    },
  };
}

const SettingsProfilePage = ({ user }) => {
  return (
    <SessionProvider user={user}>
      <TopNavigationBar />
      {user.user.npo ? <NpoSettingProfilePage /> : null}
    </SessionProvider>
  );
};

export default SettingsProfilePage;
