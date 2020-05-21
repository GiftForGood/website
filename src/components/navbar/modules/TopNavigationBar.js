import React, { useState } from 'react';
import {
  Stack,
  ButtonLink,
  Button,
  NavigationBar,
  Desktop,
  Mobile,
  Separator,
  Text,
  Drawer,
  Tile,
} from '@kiwicom/orbit-components';

import {
  StarFull,
  QuestionCircle,
  AccountCircle,
  ChevronDown,
  MenuHamburger,
  Notification,
  Messages,
  Search,
} from '@kiwicom/orbit-components/lib/icons';
import styled from 'styled-components';
import useMediaQuery from '@kiwicom/orbit-components/lib/hooks/useMediaQuery';
import TopLeftNavigation from './TopLeftNavigation';
import TopRightNavigation from './TopRightNavigation';
import CallToActionButton from '../../buttons/CallToActionButton';

const TopNavigationBar = () => {
  const { isDesktop, isTablet } = useMediaQuery();
  const [showDrawer, setShowDrawer] = useState(false);

  const onHamburgerClick = () => {
    setShowDrawer(true);
  };

  const onHamburgerClose = () => {
    setShowDrawer(false);
  };

  return (
    <>
      <NavigationBar>
        <Stack justify="between" spacing="none">
          <TopLeftNavigation onHamburgerClick={onHamburgerClick} />
          <TopRightNavigation />
         
        </Stack>
      </NavigationBar>

      <Drawer shown={showDrawer} position="left" onClose={onHamburgerClose} suppressed={false}>
        <Stack direction="column">
          <Stack direction="column" spacing="tight">
            <ButtonLink transparent type="secondary" href={'/'}>
              Wishes
            </ButtonLink>
            <ButtonLink transparent type="secondary" href={'/donations'}>
              Donations
            </ButtonLink>
            <CallToActionButton fullWidth={true}/>
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
    </>
  );
};

export default TopNavigationBar;
