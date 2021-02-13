import React from 'react';
import styled from 'styled-components';

// components
import SearchPage from '@pages/search';
import Header from '@components/header';

const Container = styled.div`
  padding: 10px;
`;

const Search = () => {
  return (
    <Container>
      <Header title="Search" />
      <SearchPage />
    </Container>
  );
};

export default Search;
