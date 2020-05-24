import React from 'react';

import Search from '@kiwicom/orbit-components/lib/icons/Search';
import { InputField, ButtonLink } from '@kiwicom/orbit-components/lib';

const SearchBar = () => {
  return (
    <InputField
      inputMode="search"
      placeholder="Search post or users"
      suffix={<ButtonLink iconLeft={<Search />} onClick={function () {}} size="normal" transparent />}
    />
  );
};

export default SearchBar;
