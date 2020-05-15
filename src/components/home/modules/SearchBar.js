import React from 'react';

import Search from '@kiwicom/orbit-components/lib/icons/Search';
import { InputField, Button } from '@kiwicom/orbit-components/lib';

const SearchBar = () => {
  return (
    <InputField
      inputMode="search"
      placeholder="Search post or users"
      suffix={
        <Button type="white" onClick={function () {}}>
          <Search />{' '}
        </Button>
      }
    />
  );
};

export default SearchBar;
