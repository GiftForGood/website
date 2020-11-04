import React from 'react';
import { useRouter } from 'next/router';
import MobileSearchBar from '../modules/MobileSearchBar';

const SearchPage = () => {
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

  return <MobileSearchBar onEnterPressed={onEnterPressed} />;
};

export default SearchPage;
