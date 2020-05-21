import React, { useState } from 'react';
import { Stack, ButtonLink, NavigationBar, Separator, Drawer } from '@kiwicom/orbit-components';
import TopLeftNavigation from './TopLeftNavigation';
import TopRightNavigation from './TopRightNavigation';
import CallToActionButton from '../../buttons/CallToActionButton';

const TopNavigationBar = () => {
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
    </>
  );
};

export default TopNavigationBar;
