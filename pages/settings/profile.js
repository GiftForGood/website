import React from 'react';
import SessionProvider from '@components/session/modules/SessionProvider';
import { isAuthenticated } from '@utils/authentication/authentication';
import dynamic from 'next/dynamic';
import NpoSettingProfilePage from '@components/settings-profile/npo/pages/NpoSettingProfilePage';
import DonorSettingProfilePage from '@components/settings-profile/donor/pages/DonorSettingProfilePage';
import { isNpoUser, isDonorUser } from '@utils/authentication/userType';
import Header from '@components/header';

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
