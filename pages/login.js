import React, { useEffect } from 'react';
import { withRouter } from 'next/router';
import { isAuthenticated } from '@utils/authentication/authentication';
import LoginPage from '@components/login/pages/LoginPage';
import Header from '@components/header';

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
