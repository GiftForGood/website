import React from 'react';

import Search from '@kiwicom/orbit-components/lib/icons/Search';
import { InputField, ButtonLink } from '@kiwicom/orbit-components/lib';
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
      suffix={<ButtonLink iconLeft={<Search />} onClick={function () {}} size="normal" transparent />}
    />
  );
};

export default SearchBar;
