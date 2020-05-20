import React from 'react';
import SessionProvider from '../src/components/session/modules/SessionProvider';
import useUser from '../src/components/session/modules/useUser';
import { isAuthenticated } from '../utils/authentication/authentication';
import { withRedux } from '../utils/withRedux';
import Verified from '../src/components/session/modules/Verified';
import WishesHomePage from '../src/components/home/pages/WishesHomePage';

export async function getServerSideProps({ params, req, res, query }) {
  let user = await isAuthenticated(req, res);
  return {
    props: {
      user,
    },
  };
}

const WishesHome = ({ user }) => {
  const userData = useUser();
  return (
    <SessionProvider user={user}>
      <WishesHomePage />
    </SessionProvider>
  );
};

export default withRedux(WishesHome);
