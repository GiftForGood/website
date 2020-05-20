import React from 'react';
import { setCurrentUser } from '../actions';
import { useDispatch } from 'react-redux';

const SessionProvider = ({ user, children }) => {
  const dispatch = useDispatch();
  if (user) {
    dispatch(setCurrentUser(user));
  }

  return <>{children}</>;
};

export default SessionProvider;
