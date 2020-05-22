import React from 'react';
import DonationsHomePage from '../src/components/home/pages/DonationsHomePage';
import SessionProvider from '../src/components/session/modules/SessionProvider';
import useUser from '../src/components/session/modules/useUser';
import { isAuthenticated } from '../utils/authentication/authentication';
import { withRedux } from '../utils/withRedux';
import dynamic from 'next/dynamic';
const TopNavigationBar = dynamic(() => import('../src/components/navbar/modules/TopNavigationBar'), { ssr: false });

export async function getServerSideProps({ params, req, res, query }) {
  let user = await isAuthenticated(req, res);
  return {
    props: {
      user,
    },
  };
}

const DonationsHome = ({ user }) => {
  const userData = useUser();
  return (
    <SessionProvider user={user}>
      <TopNavigationBar />
      <DonationsHomePage />
    </SessionProvider>
  );
};

export default withRedux(DonationsHome);
