import React, { useState } from 'react';
import SearchBar from '../modules/SearchBarV2';
import { useRouter } from 'next/router';

const NavSearchBar = () => {
  const router = useRouter();

  const onEnterPressed = (query, selectedIndex) => {
    router.push(`/${selectedIndex}/category`, `/${selectedIndex}/category?q=${query}`);
  };

  return (
    <>
      <SearchBar onEnterPressed={onEnterPressed} />
    </>
  );
};

export default NavSearchBar;
