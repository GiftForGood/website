import React from 'react';
import { ButtonLink, InputField, Stack } from '@kiwicom/orbit-components/';
import { MenuHamburger } from '@kiwicom/orbit-components/lib/icons';

import { companyIconImagePath } from '@constants/imagePaths';

const MobileSearchBar = ({ onClick }) => {
  return (
    <InputField fullWidth inputMode="search" onClick={onClick} placeholder="Search for wishes, donations or NPOs" />
  );
};

const MobileTopNavigation = ({ onHamburgerClick }) => {
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
