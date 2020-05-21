import React from 'react';

import Search from '@kiwicom/orbit-components/lib/icons/Search';
import { InputField, Button } from '@kiwicom/orbit-components/lib';
import styled from 'styled-components';

const SearchButton = styled.button`
  width: 80%;
  height: 80%;
  background: white;
  margin-right: 5px;
  padding: 0px;
`;

const SearchBar = () => {
  return (
    <InputField
      inputMode="search"
      placeholder="Search post or users"
      suffix={
        <Button type="white" asComponent={SearchButton} onClick={function () {}}>
          <Search />
        </Button>
      }
    />
  );
};

export default SearchBar;
