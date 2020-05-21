import React from 'react';
import { Stack, ButtonLink } from '@kiwicom/orbit-components/';
import { MenuHamburger } from '@kiwicom/orbit-components/lib/icons';
import useMediaQuery from '@kiwicom/orbit-components/lib/hooks/useMediaQuery';
import LogoButton from '../../buttons/LogoButton'

const TopLeftNavigation = ({ onHamburgerClick }) => {
  const { isDesktop, isTablet } = useMediaQuery();
  return (
    <Stack direction="row" shrink spacing="tight">
      {isDesktop || isTablet ? (
        <>
          <LogoButton
            src={'https://res.cloudinary.com/giftforgood/image/upload/v1590053648/dummyLogo_amfjj2.svg'}
            height={25}
            href={'/'}
          />

          <ButtonLink transparent type="secondary" href={'/'}>
            Wishes
          </ButtonLink>
          <ButtonLink transparent type="secondary" href={'/donations'}>
            Donations
          </ButtonLink>
        </>
      ) : (
        <ButtonLink iconLeft={<MenuHamburger />} transparent type="secondary" onClick={onHamburgerClick} />
      )}
    </Stack>
  );
};

export default TopLeftNavigation;
