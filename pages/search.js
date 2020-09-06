import React from 'react';
import styled from 'styled-components';
import SearchPage from '@components/search/pages/SearchPage';
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
