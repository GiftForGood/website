import React from 'react';

import Search from '@kiwicom/orbit-components/lib/icons/Search';
import { InputField, Button } from '@kiwicom/orbit-components/lib';
import styled from 'styled-components';

const SearchButton = styled.button`
  width: 20px;
  height: 20px;
  background: white;
  margin: 10px;
  padding: 0px;
`;

const SearchBar = () => {
  return (
    <InputField
      inputMode="search"
      placeholder="Search post or users"
      suffix={
      <Button type="white" asComponent={SearchButton} onClick={function () {}}>
          <Search />{' '}
        </Button>
      }
    />
  );
};

export default SearchBar;
