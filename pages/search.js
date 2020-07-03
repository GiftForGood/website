import React from 'react';
import styled from 'styled-components';
import SearchPage from '../src/components/search/pages/SearchPage';

const Container = styled.div`
  padding: 10px;
`;

const Search = () => {
  return (
    <Container>
      <SearchPage />
    </Container>
  );
};

export default Search;
