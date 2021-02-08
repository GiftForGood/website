import React from 'react';
import styled from 'styled-components';
import { ButtonLink, InputField, Stack } from '@kiwicom/orbit-components/';
import { MenuHamburger } from '@kiwicom/orbit-components/lib/icons';
import { useRouter } from 'next/router';
import { companyIconImagePath } from '@constants/imagePaths';

const MobileSearchBarContainer = styled.div`
  width: 100%;
`;

const MobileSearchBar = ({ onClick }) => {
  return (
    <MobileSearchBarContainer onClick={onClick}>
      <InputField fullWidth inputMode="search" placeholder="Search for wishes, donations or NPOs" />
    </MobileSearchBarContainer>
  );
};

const MobileTopNavigation = ({ onHamburgerClick }) => {
  const router = useRouter();
  const onMobileSearchClick = () => {
    router.push('/search');
  };
  return (
    <Stack direction="row" shrink spacing="tight">
      <ButtonLink
        href={'/'}
        iconLeft={<img src={companyIconImagePath} alt="logo" height="30" />}
        transparent
        type="secondary"
      />
      <MobileSearchBar onClick={onMobileSearchClick} />
      <ButtonLink iconLeft={<MenuHamburger />} transparent type="secondary" onClick={onHamburgerClick} />
    </Stack>
  );
};

export default MobileTopNavigation;
