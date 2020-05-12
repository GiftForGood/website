import React, { useState, useEffect } from 'react';

import Search from '@kiwicom/orbit-components/lib/icons/Search';
import { InputField, Button } from '@kiwicom/orbit-components/lib';
import styled from 'styled-components';

const SearchBarContainer = styled.div`
  position: absolute;
  top: 60%;
  left: 50%;
  width: 50%;
  min-width: 10rem;
  transform: translate(-50%, -50%);
`;

const SearchBar = () => {
  return (
    <SearchBarContainer>
      <InputField
        inputMode="search"
        placeholder="Search post or users"
        suffix={
          <Button type="white" onClick={function () {}}>
            <Search />{' '}
          </Button>
        }
      />
    </SearchBarContainer>
  );
};

export default SearchBar;
