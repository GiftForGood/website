import React, { useState } from 'react';
import { Stack, ButtonLink, NavigationBar, Separator, Drawer } from '@kiwicom/orbit-components';
import TopLeftNavigation from './TopLeftNavigation';
import TopRightNavigation from './TopRightNavigation';
import CallToActionButton from '../../buttons/CallToActionButton';
import styled, { css } from 'styled-components';
import EmailVerificationNavigationBar from './EmailVerificationNavigationBar';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';
import { EMAIL_BAR_HEIGHT, NAVBAR_HEIGHT } from '../../../../utils/constants/navbar';
import useUser from '../../session/modules/useUser';

const NavContainer = styled.div`
  display: flex;
  height: ${(props) =>
    props.user
      ? props.user.emailVerified
        ? NAVBAR_HEIGHT.MOBILE
        : NAVBAR_HEIGHT.MOBILE + EMAIL_BAR_HEIGHT.MOBILE
      : NAVBAR_HEIGHT.MOBILE}px;

  ${media.largeMobile(css`
    height: ${(props) =>
      props.user
        ? props.user.emailVerified
          ? NAVBAR_HEIGHT.DESKTOP
          : NAVBAR_HEIGHT.DESKTOP + EMAIL_BAR_HEIGHT.DESKTOP
        : NAVBAR_HEIGHT.DESKTOP}px;
  `)};
`;
const TopNavigationBar = () => {
  const user = useUser();
  const [showDrawer, setShowDrawer] = useState(false);

  const onHamburgerClick = () => {
    setShowDrawer(true);
  };

  const onHamburgerClose = () => {
    setShowDrawer(false);
  };

  return (
    <NavContainer user={user}>
      <NavigationBar>
        <Stack justify="between" spacing="none">
          <TopLeftNavigation onHamburgerClick={onHamburgerClick} />
          <TopRightNavigation />
        </Stack>
      </NavigationBar>
      <EmailVerificationNavigationBar />
      <Drawer shown={showDrawer} position="left" onClose={onHamburgerClose} suppressed={false}>
        <Stack direction="column">
          <Stack direction="column" spacing="tight">
            <ButtonLink transparent type="secondary" href={'/'}>
              Wishes
            </ButtonLink>
            <ButtonLink transparent type="secondary" href={'/donations'}>
              Donations
            </ButtonLink>
            <CallToActionButton fullWidth={true} />
          </Stack>

          <Separator fullWidth />

          <Stack direction="column" spacing="tight">
            <ButtonLink transparent type="secondary">
              Terms and Conditions
            </ButtonLink>
            <ButtonLink transparent type="secondary">
              Privacy Policy
            </ButtonLink>
            <ButtonLink transparent type="secondary">
              Partners
            </ButtonLink>
            <ButtonLink transparent type="secondary">
              Blog
            </ButtonLink>
          </Stack>
        </Stack>
      </Drawer>
    </NavContainer>
  );
};

export default TopNavigationBar;
