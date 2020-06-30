import React from 'react';
import Error from 'next/error';
import ResetPassword from '../modules/ResetPassword';
import VerifyEmail from '../modules/VerifyEmail';

const ActionPage = ({ mode, oobCode, continueUrl }) => {
  const getComponent = (mode) => {
    switch (mode) {
      case 'resetPassword':
        return <ResetPassword oobCode={oobCode} continueUrl={continueUrl} />;
      case 'verifyEmail':
        return <VerifyEmail oobCode={oobCode} continueUrl={continueUrl} />;
      default:
        return <Error statusCode={404} />;
    }
  };
  return <>{getComponent(mode)}</>;
};

export default ActionPage;
