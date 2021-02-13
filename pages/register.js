import React from 'react';

// hoc
import { withRouter } from 'next/router';

// constants and utils
import { isAuthenticated } from '@utils/authentication/authentication';

// components
import RegisterPage from '@pages/register';
import Header from '@components/header';

// Route back to home page if already authenticated
export async function getServerSideProps({ params, req, res, query }) {
  let user = await isAuthenticated(req, res);
  if (user) {
    res.writeHead(302, { Location: '/' });
    res.end();
  }
  return {
    props: {
      user,
    },
  };
}

const Register = () => {
  return (
    <div>
      <Header title="Register | GiftForGood" />
      <RegisterPage />
    </div>
  );
};

export default withRouter(Register);
