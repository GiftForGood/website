import React, { useState } from 'react';
import SearchBar from '../modules/SearchBarV2';
import { useRouter } from 'next/router';

const NavSearchBar = ({ searchDefaultIndex }) => {
  const router = useRouter();

  const onEnterPressed = (query, selectedIndex) => {
    if (query.trim().length !== 0) {
      if (selectedIndex === 'npos') {
        router.push(`/${selectedIndex}?q=${encodeURIComponent(query)}`);
      } else {
        router.push(`/${selectedIndex}/category?q=${encodeURIComponent(query)}`);
      }
    }
  };

  return (
    <>
      <SearchBar onEnterPressed={onEnterPressed} defaultIndex={searchDefaultIndex} />
    </>
  );
};

export default NavSearchBar;
