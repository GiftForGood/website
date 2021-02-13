import React from 'react';

// components
import Header from '@components/header';
import LoginPage from '@pages/login';

// hooks
import { withRouter } from 'next/router';

// utils and constants
import { isAuthenticated } from '@utils/authentication/authentication';

// Route back to home page if already authenticated
export async function getServerSideProps({ params, req, res, query }) {
  let user = await isAuthenticated(req, res);
  if (user) {
    res.writeHead(302, { Location: '/' });
    res.end();
  }
  let redirectUrlAfterLogin = query.redirect ? query.redirect : null;
  return {
    props: {
      user,
      redirectUrlAfterLogin,
    },
  };
}

const Login = ({ redirectUrlAfterLogin }) => {
  return (
    <div>
      <Header title="Login | GiftForGood" />
      <LoginPage redirectUrlAfterLogin={redirectUrlAfterLogin} />
    </div>
  );
};

export default withRouter(Login);
