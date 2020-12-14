import React from 'react';
import { Stack, ButtonLink, Separator, Drawer } from '@kiwicom/orbit-components';

import api from '@api';
import client from '@utils/axios';
import { logout } from '../../session/actions';
import { useDispatch } from 'react-redux';
import useLocalStorage from '@utils/hooks/useLocalStorage';
import { useRouter } from 'next/router';
import useUser from '../../session/modules/useUser';

const MobileDrawer = ({ shown, onClose }) => {
  const router = useRouter();
  const user = useUser();
  const [registeredObjectString, setRegisteredObjectString] = useLocalStorage(
    'registered',
    '{"isNewlyRegistered":true}'
  );
  const dispatch = useDispatch();

  const onLogoutClick = async () => {
    try {
      await api.auth.logout();
      let response = await client.post('/api/sessionLogout');
      if (response.status === 200) {
        dispatch(logout());
        setRegisteredObjectString('{"isNewlyRegistered":true}');
        router.push('/');
      } else {
        throw response.error;
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Drawer shown={shown} position="right" onClose={onClose} suppressed={false}>
      <Stack direction="column">
        <Stack direction="column" spacing="tight">
          {user ? (
            <>
              <ButtonLink transparent type="secondary" onClick={onLogoutClick}>
                Logout
              </ButtonLink>
            </>
          ) : (
            <>
              <ButtonLink transparent type="secondary" href={'/register'}>
                Register
              </ButtonLink>
              <ButtonLink transparent type="secondary" href={'/login'}>
                Login
              </ButtonLink>
            </>
          )}
        </Stack>

        <Separator fullWidth />

        <Stack direction="column" spacing="tight">
          <ButtonLink transparent href="/about" type="secondary">
            About Us
          </ButtonLink>
          <ButtonLink transparent href="/partners" type="secondary">
            Partners
          </ButtonLink>
          <ButtonLink transparent href="/delivery-partners" type="secondary">
            Delivery Partners
          </ButtonLink>
          <ButtonLink transparent href="https://dsc.comp.nus.edu.sg" type="secondary">
            Developer Student Club
          </ButtonLink>
          <ButtonLink transparent href="/contact" type="secondary">
            Contact Us
          </ButtonLink>
          <ButtonLink transparent href="/faq" type="secondary">
            FAQ
          </ButtonLink>
          <ButtonLink transparent href="/privacy-policy" type="secondary">
            Privacy Policy
          </ButtonLink>
          <ButtonLink transparent href="/terms-and-conditions" type="secondary">
            Terms and Conditions
          </ButtonLink>
          <ButtonLink transparent href="/credits" type="secondary">
            Credits
          </ButtonLink>
        </Stack>
      </Stack>
    </Drawer>
  );
};

export default MobileDrawer;
