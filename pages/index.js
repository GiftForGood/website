import React from 'react';
import SessionProvider from '../src/components/session/modules/SessionProvider';
import useUser from '../src/components/session/modules/useUser';
import { isAuthenticated } from '../utils/authentication';
import { withRedux } from '../utils/withRedux';
import Verified from '../src/components/session/modules/Verified';

export async function getServerSideProps({ params, req, res, query }) {
  let user = await isAuthenticated(req, res);
  return {
    props: {
      user,
    },
  };
}

const HomePage = ({ user }) => {
  const userData = useUser();

  return (
    <SessionProvider user={user}>
      <div>Welcome to Next.js Home page!!! {userData ? userData.name : ''}</div>
      <Verified>
        {({ isDisabled }) => <button disabled={isDisabled}>Only Verified user can click on me</button>}
      </Verified>
    </SessionProvider>
  );
};

export default withRedux(HomePage);
