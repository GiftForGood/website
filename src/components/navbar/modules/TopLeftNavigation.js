import React from 'react';
import { Stack, ButtonLink } from '@kiwicom/orbit-components/';
import { MenuHamburger } from '@kiwicom/orbit-components/lib/icons';
import useMediaQuery from '@kiwicom/orbit-components/lib/hooks/useMediaQuery';
import LogoButton from '../../buttons/LogoButton';
import { companyLogoImagePath } from '../../../../utils/constants/imagePaths';
import styled, { css } from 'styled-components';
import NavSearchBar from '../../search/modules/NavSearchBar';
import Link from 'next/link';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';

const SearchBarContainer = styled.div`
  min-width: 450px;
  margin-right: 15px !important;

  ${media.largeMobile(css`
    min-width: 380px;
  `)};

  ${media.largeDesktop(css`
    min-width: 450px;
  `)};
`;

const TopLeftNavigation = ({ onHamburgerClick, searchDefaultIndex }) => {
  const { isDesktop } = useMediaQuery();
  return (
    <Stack direction="row" shrink spacing="tight">
      {isDesktop ? (
        <>
          <LogoButton src={companyLogoImagePath} height={45} href={'/'} />
          <SearchBarContainer>
            <NavSearchBar searchDefaultIndex={searchDefaultIndex} />
          </SearchBarContainer>

          <Link href="/">
            <ButtonLink type="secondary" href={'/'}>
              Wishes
            </ButtonLink>
          </Link>

          <Link href="/donations">
            <ButtonLink type="secondary" href={'/donations'}>
              Donations
            </ButtonLink>
          </Link>
        </>
      ) : (
        <ButtonLink iconLeft={<MenuHamburger />} transparent type="secondary" onClick={onHamburgerClick} />
      )}
    </Stack>
  );
};

export default TopLeftNavigation;
