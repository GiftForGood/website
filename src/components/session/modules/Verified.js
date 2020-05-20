import React from 'react';
import useUser from '../../../components/session/modules/useUser';

const Verified = (props) => {
  const userData = useUser();

  return props.children({
    isDisabled: userData ? !userData.emailVerified : true,
  });
};

export default Verified;
