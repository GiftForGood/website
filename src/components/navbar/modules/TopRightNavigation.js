import React from 'react';
import { Stack, Button, ButtonLink, Popover } from '@kiwicom/orbit-components/';
import useMediaQuery from '@kiwicom/orbit-components/lib/hooks/useMediaQuery';
import BlackButton from '../../buttons/BlackButton';
import useUser from '../../session/modules/useUser';
import { AccountCircle, Notification, Messages, Search } from '@kiwicom/orbit-components/lib/icons';
import CallToActionButton from '../../buttons/CallToActionButton';
import { useRouter } from 'next/router';
import Desktop from '@kiwicom/orbit-components/lib/Desktop';
import Mobile from '@kiwicom/orbit-components/lib/Mobile';
import api from '../../../../utils/api';
import client from '../../../../utils/axios';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { logout } from '../../session/actions';

const AccountImageContainer = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
`;

const AccountImageRounded = styled.img`
  border-radius: 24px;
  width: 24px;
  height: 24px;
`;

const AccountImage = ({ src }) => {
  return (
    <AccountImageContainer>
      <AccountImageRounded src={src} />
    </AccountImageContainer>
  );
};

const AccountButton = ({ onNotificationClick, onLogoutClick, user }) => {
  return (
    <Popover
      content={
        <Stack direction="column" spacing="extraTight">
          <ButtonLink transparent type="secondary" href={`/profile/${user.userId}`}>
            View Profile
          </ButtonLink>
          <ButtonLink transparent type="secondary" href="/settings/profile">
            Settings
          </ButtonLink>
          <ButtonLink transparent type="secondary" onClick={onNotificationClick}>
            Notifications
          </ButtonLink>
          <ButtonLink transparent type="secondary" onClick={onLogoutClick}>
            Logout
          </ButtonLink>
        </Stack>
      }
      preferredAlign="end"
    >
      <ButtonLink
        iconLeft={
          user ? (
            user.profileImageUrl ? (
              <AccountImage src={user.profileImageUrl} />
            ) : (
              <AccountCircle />
            )
          ) : (
            <AccountCircle />
          )
        }
        transparent
        type="secondary"
      />
    </Popover>
  );
};

const LoggedInButtons = () => {
  const user = useUser();
  const router = useRouter();
  const dispatch = useDispatch();

  const onLogoutClick = async () => {
    try {
      await api.auth.logout();
      let response = await client.post('/api/sessionLogout');
      if (response.status === 200) {
        dispatch(logout());
        router.push('/');
      } else {
        throw response.error;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onNotificationClick = () => {
    // TODO: Add popover
    console.log('NotificationClicked');
  };

  return (
    <>
      <Desktop>
        <Stack direction="row" justify="end" align="center" shrink spacing="extraTight">
          <ButtonLink iconLeft={<Notification />} transparent type="secondary" onClick={onNotificationClick} />
          <ButtonLink iconLeft={<Messages />} transparent type="secondary" href="/chat" />
          <AccountButton onNotificationClick={onNotificationClick} onLogoutClick={onLogoutClick} user={user} />
          <CallToActionButton />
        </Stack>
      </Desktop>

      <Mobile>
        <Stack direction="row" justify="end" align="center" shrink spacing="extraTight">
          <ButtonLink iconLeft={<Search />} transparent type="secondary" href="/mobile-search" />
          <ButtonLink iconLeft={<Messages />} transparent type="secondary" href="/chat" />
          <AccountButton onNotificationClick={onNotificationClick} onLogoutClick={onLogoutClick} user={user} />
        </Stack>
      </Mobile>
    </>
  );
};

const NotLoggedInButtons = () => {
  const router = useRouter();
  const onLoginClick = () => router.push('/login');
  const onRegisterClick = () => router.push('/register');
  return (
    <>
      <ButtonLink transparent type="secondary" onClick={onRegisterClick}>
        Register
      </ButtonLink>
      <Button transparent asComponent={BlackButton} onClick={onLoginClick}>
        Login
      </Button>
    </>
  );
};

const TopRightNavigation = () => {
  const user = useUser();
  return (
    <>
      <Stack direction="row" justify="end" align="center" shrink spacing="extraTight">
        {user ? <LoggedInButtons /> : <NotLoggedInButtons />}
      </Stack>
    </>
  );
};

export default TopRightNavigation;
