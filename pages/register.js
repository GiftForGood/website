import React from 'react';
import { withRouter } from 'next/router';
import { isAuthenticated } from '../utils/authentication/authentication';
import RegisterPage from '../src/components/register/pages/RegisterPage';

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
      <RegisterPage />
    </div>
  );
};

export default withRouter(Register);
