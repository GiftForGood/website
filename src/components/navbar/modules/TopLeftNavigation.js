import React from 'react';
import { Stack, ButtonLink } from '@kiwicom/orbit-components/';
import { MenuHamburger } from '@kiwicom/orbit-components/lib/icons';
import useMediaQuery from '@kiwicom/orbit-components/lib/hooks/useMediaQuery';
import LogoButton from '../../buttons/LogoButton';
import SearchBar from '../../search/SearchBar';
import { companyLogoImagePath } from '../../../../utils/constants/imagePaths';
import styled from 'styled-components';
import Link from 'next/link';

const SearchBarContainer = styled.div`
  min-width: 350px;
  margin-right: 15px !important;
`;
const TopLeftNavigation = ({ onHamburgerClick }) => {
  const { isDesktop, isTablet } = useMediaQuery();
  return (
    <Stack direction="row" shrink spacing="tight">
      {isDesktop || isTablet ? (
        <>
          <LogoButton src={companyLogoImagePath} height={45} href={'/'} />
          {isDesktop && (
            <SearchBarContainer>
              <SearchBar />
            </SearchBarContainer>
          )}
          <Link href="/">
            <ButtonLink transparent type="secondary" href={'/'}>
              Wishes
            </ButtonLink>
          </Link>

          <Link href="/donations">
            <ButtonLink transparent type="secondary" href={'/donations'}>
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
