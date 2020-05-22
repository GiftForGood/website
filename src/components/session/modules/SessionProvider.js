import React, { useEffect } from 'react';
import { setCurrentUser } from '../actions';
import { useDispatch } from 'react-redux';

const SessionProvider = ({ user, children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      dispatch(setCurrentUser(user));
    }
  }, []);

  return <>{children}</>;
};

export default SessionProvider;
