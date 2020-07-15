import React from 'react';
import SearchBarV2 from '../modules/SearchBarV2';
import { useRouter } from 'next/router';

const SearchPage = () => {
  const router = useRouter();

  const onEnterPressed = (query, selectedIndex) => {
    router.push(`/${selectedIndex}/category`, `/${selectedIndex}/category?q=${query}`);
  };

  return <SearchBarV2 onEnterPressed={onEnterPressed} />;
};

export default SearchPage;
