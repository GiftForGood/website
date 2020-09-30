import React from 'react';
import SessionProvider from '@components/session/modules/SessionProvider';
import { isAuthenticated } from '@utils/authentication/authentication';
import dynamic from 'next/dynamic';
import Header from '@components/header';
import NpoApplicationPage from '@components/settings-npoApplication/pages/NpoApplicationPage';

const TopNavigationBar = dynamic(() => import('@components/navbar/modules/TopNavigationBar'), { ssr: false });
const Footer = dynamic(() => import('@components/footer/Footer'), { ssr: false });

export async function getServerSideProps({ params, req, res, query }) {
  let user = await isAuthenticated(req, res);
  if (!user) {
    res.writeHead(302, { Location: '/' });
    res.end();
  }
  if (!user.user.npo) {
    res.writeHead(302, { Location: '/' });
    res.end();
  }
  return {
    props: {
      user,
    },
  };
}

const NpoApplication = ({ user }) => {
  return (
    <SessionProvider user={user}>
      <Header title="Settings | GiftForGood" />
      <TopNavigationBar showNews={true} />
      <NpoApplicationPage />
      <Footer />
    </SessionProvider>
  );
};

export default NpoApplication;
