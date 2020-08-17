import React, { useEffect } from 'react';
import { setCurrentUser } from '../actions';
import { useDispatch } from 'react-redux';
import { firebaseAuth } from '../../../../utils/firebase';
import useLocalStorage from '../../../../utils/hooks/useLocalStorage';

const SessionProvider = ({ user, children }) => {
  const dispatch = useDispatch();
  const [registeredObjectString, setRegisteredObjectString] = useLocalStorage(
    'registered',
    '{"isNewlyRegistered":true}'
  );

  useEffect(() => {
    if (user) {
      dispatch(setCurrentUser(user));
      const registeredObject = JSON.parse(registeredObjectString);
      if (user && user.user.emailVerified && user.user.isClaimSet && registeredObject.isNewlyRegistered) {
        firebaseAuth.onAuthStateChanged((currentUser) => {
          if (currentUser) {
            currentUser
              .getIdTokenResult(true)
              .then((idTokenResult) => {
                const registered = {
                  isNewlyRegistered: false,
                };
                setRegisteredObjectString(JSON.stringify(registered));
              })
              .catch((error) => {
                console.error(error);
              });
          }
        });
      }
    } else {
      setRegisteredObjectString('{"isNewlyRegistered":true}');
    }
  }, []);

  return <>{children}</>;
};

export default SessionProvider;
