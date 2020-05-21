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

const AccountButton = () => {
  return (
    <Popover
      content={
        <Stack spacing="extraTight">
          <ButtonLink transparent type="secondary" href="/profile">
            View Profile
          </ButtonLink>
          <ButtonLink transparent type="secondary" href="/settings">
            Settings
          </ButtonLink>
          <ButtonLink transparent type="secondary">
            Notifications
          </ButtonLink>
          <ButtonLink transparent type="secondary">
            Logout
          </ButtonLink>
        </Stack>
      }
      preferredAlign="end"
    >
      <ButtonLink iconLeft={<AccountCircle />} transparent type="secondary" />
    </Popover>
  );
};
const LoggedInButtons = () => {
  const user = useUser();

  return (
    <>
      <Desktop>
        <Stack direction="row" justify="end" align="center" shrink spacing="extraTight">
          <ButtonLink iconLeft={<Notification />} transparent type="secondary" />
          <ButtonLink iconLeft={<Messages />} transparent type="secondary" />
          <AccountButton />
          <CallToActionButton />
        </Stack>
      </Desktop>

      <Mobile>
        <Stack direction="row" justify="end" align="center" shrink spacing="extraTight">
          <ButtonLink iconLeft={<Search />} transparent type="secondary" />
          <ButtonLink iconLeft={<Messages />} transparent type="secondary" />
          <AccountButton />
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
  //const user = useUser();
  const user = {
    userId: '1231',
    name: 'Marcus',
    profileImageUrl: '',
    reviewRating: 0,
    hasAcceptedTermsOfService: true,
    isBlocked: false,
    isForcedRefreshRequired: false,
    joinedDateTime: 'now',
    lastLoggedInDateTime: 'now',
    donor: true,
    emailVerified: true,
  };
  return (
    <>
      <Stack direction="row" justify="end" align="center" shrink spacing="extraTight">
        {user ? <LoggedInButtons /> : <NotLoggedInButtons />}
      </Stack>
    </>
  );
};

export default TopRightNavigation;
