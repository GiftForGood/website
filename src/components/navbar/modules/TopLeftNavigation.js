import React from 'react';
import { Stack, ButtonLink } from '@kiwicom/orbit-components/';
import LogoButton from '../../buttons/LogoButton';
import { companyLogoImagePath } from '@constants/imagePaths';
import styled, { css } from 'styled-components';
import { NavSearchBar } from '@pages/search/components';
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

const TopLeftNavigation = ({ searchDefaultIndex }) => {
  return (
    <Stack direction="row" shrink spacing="tight">
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

      <Link href="/npos">
        <ButtonLink type="secondary" href={'/npos'}>
          NPOs
        </ButtonLink>
      </Link>
    </Stack>
  );
};

export default TopLeftNavigation;
