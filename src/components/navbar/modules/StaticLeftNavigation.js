import React from 'react';
import { Stack, ButtonLink } from '@kiwicom/orbit-components/';
import { MenuHamburger } from '@kiwicom/orbit-components/lib/icons';
import useMediaQuery from '@kiwicom/orbit-components/lib/hooks/useMediaQuery';
import LogoButton from '../../buttons/LogoButton';
import { companyLogoImagePath } from '@constants/imagePaths';
import styled, { css } from 'styled-components';
import NavSearchBar from '../../search/modules/NavSearchBar';
import Link from 'next/link';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';



const TopLeftNavigation = ({ onHamburgerClick, searchDefaultIndex }) => {
  const { isDesktop } = useMediaQuery();
  return (
    <Stack direction="row" shrink spacing="tight">
      {isDesktop ? (
        <>
          <LogoButton src={companyLogoImagePath} height={45} href={'/'} />
        </>
      ) : (
        <ButtonLink iconLeft={<MenuHamburger />} transparent type="secondary" onClick={onHamburgerClick} />
      )}
    </Stack>
  );
};

export default TopLeftNavigation;
