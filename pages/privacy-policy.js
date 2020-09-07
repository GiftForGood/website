import React from 'react';
import MaxWithContainer from '@components/containers/maxWidthContainer';
import { PRIVACY_POLICY } from '@constants/legal';

import SessionProvider from '@components/session/modules/SessionProvider';
import { isAuthenticated } from '@utils/authentication/authentication';
import dynamic from 'next/dynamic';
import Header from '@components/header';
import { WISHES } from '@constants/search';

const TopNavigationBar = dynamic(() => import('@components/navbar/modules/TopNavigationBar'), { ssr: false });
const BottomNavigation = dynamic(() => import('@components/navbar/modules/BottomNavigation'), { ssr: false });
const Footer = dynamic(() => import('@components/footer/Footer'), { ssr: false });

export async function getServerSideProps({ params, req, res, query }) {
  let user = await isAuthenticated(req, res);
  return {
    props: {
      user,
    },
  };
}

const PrivacyPolicy = ({ user }) => {
  const createHTML = () => {
    return { __html: PRIVACY_POLICY };
  };

  return (
    <SessionProvider user={user}>
      <Header title="Privacy Policy | GiftForGood" />
      <TopNavigationBar showNews={true} searchDefaultIndex={WISHES} />
      <MaxWithContainer>
        <div dangerouslySetInnerHTML={createHTML()} />
      </MaxWithContainer>
      <BottomNavigation />
      <Footer />
    </SessionProvider>
  );
};

export default PrivacyPolicy;
