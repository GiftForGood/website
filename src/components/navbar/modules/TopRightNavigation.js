import React from 'react';
import { Stack, Button, ButtonLink, Popover, NotificationBadge } from '@kiwicom/orbit-components/';
import BlackButton from '../../buttons/BlackButton';
import useUser from '../../session/modules/useUser';
import { AccountCircle, Notification, Messages, Search } from '@kiwicom/orbit-components/lib/icons';
import CallToActionButton from '../../buttons/CallToActionButton';
import { useRouter } from 'next/router';
import api from '@api';
import client from '@utils/axios';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { logout } from '../../session/actions';
import useLocalStorage from '@utils/hooks/useLocalStorage';

const AccountImageContainer = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
`;

const AccountImageRounded = styled.img`
  border-radius: 24px;
  width: 24px;
  height: 24px;
  object-fit: cover;
`;

const NotificationButtonContainer = styled.div`
  position: relative;
`;

const NotificationBadgeWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
`;

const NotificationBadgeWrapperInPopover = styled.div`
  position: absolute;
  top: 50%;
  right: -10px;
  transform: translate(0, -50%);
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
          {/* <NotificationButtonContainer>
            <ButtonLink transparent type="secondary" onClick={onNotificationClick}>
              Notifications
            </ButtonLink>
            {user.unreadNotificationsCount > 0 && (
              <NotificationBadgeWrapperInPopover>
                <NotificationBadge type="criticalInverted">{user.unreadNotificationsCount}</NotificationBadge>
              </NotificationBadgeWrapperInPopover>
            )}
          </NotificationButtonContainer> */}
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
            user.profileImageUrl?.raw ? (
              <AccountImage src={user.profileImageUrl.small || user.profileImageUrl.raw} />
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
  const [registeredObjectString, setRegisteredObjectString] = useLocalStorage(
    'registered',
    '{"isNewlyRegistered":true}'
  );

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

  const onNotificationClick = () => {
    // TODO: Add popover
    console.log('NotificationClicked');
  };

  return (
    <Stack direction="row" justify="end" align="center" shrink spacing="extraTight">
      {/* <NotificationButtonContainer>
        <ButtonLink iconLeft={<Notification />} transparent type="secondary" onClick={onNotificationClick} />
        {user.unreadNotificationsCount > 0 && (
          <NotificationBadgeWrapper>
            <NotificationBadge type="criticalInverted">{user.unreadNotificationsCount}</NotificationBadge>
          </NotificationBadgeWrapper>
        )}
      </NotificationButtonContainer> */}
      <NotificationButtonContainer>
        <ButtonLink iconLeft={<Messages />} transparent type="secondary" href="/chat" />
        {user.unreadChatNotificationsCount > 0 && (
          <NotificationBadgeWrapper>
            <NotificationBadge type="criticalInverted">{user.unreadChatNotificationsCount}</NotificationBadge>
          </NotificationBadgeWrapper>
        )}
      </NotificationButtonContainer>
      <AccountButton onNotificationClick={onNotificationClick} onLogoutClick={onLogoutClick} user={user} />
      <CallToActionButton />
    </Stack>
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
