import React from 'react';
import dynamic from 'next/dynamic';

// components
import SessionProvider from '@components/session/modules/SessionProvider';
import NpoSettingProfilePage from '@pages/settings-profile/npo';
import DonorSettingProfilePage from '@pages/settings-profile/donor';
import Header from '@components/header';

// constants and utils
import { isNpoUser, isDonorUser } from '@utils/authentication/userType';
import { isAuthenticated } from '@utils/authentication/authentication';

// dynamic imports
const TopNavigationBar = dynamic(() => import('@components/navbar/modules/TopNavigationBar'), { ssr: false });
const Footer = dynamic(() => import('@components/footer/Footer'), { ssr: false });

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
      <Header title="Settings | GiftForGood" />
      <TopNavigationBar showNews={true} />
      {isNpoUser(user.user) ? <NpoSettingProfilePage /> : isDonorUser(user.user) ? <DonorSettingProfilePage /> : null}
      <Footer />
    </SessionProvider>
  );
};

export default SettingsProfilePage;
