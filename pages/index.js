import React from 'react';
import SessionProvider from '../src/components/session/modules/SessionProvider';
import useUser from '../src/components/session/modules/useUser';
import { isAuthenticated } from '../utils/authentication';
import { withRedux } from '../utils/withRedux';
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
      <div>Welcome to Next.js Home page!!! {userData ? userData.name : ""}</div>
    </SessionProvider>
    
  )
}

export default withRedux(HomePage);
