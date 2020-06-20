import React from 'react';
import { InstantSearch, connectSearchBox, Index, Configure, connectHits } from 'react-instantsearch-dom';
import { Text, ListChoice } from '@kiwicom/orbit-components/lib';
import SearchBar from '../SearchBar';
import algoliasearch from 'algoliasearch/lite';
import styled from 'styled-components';
import { useRouter } from 'next/router';

const searchClient = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_ADMIN_KEY);

const CustomSearchBox = connectSearchBox(SearchBar);

const Hits = ({ hits, type }) => {
  const router = useRouter();
  const handleOnClick = (type, objectID) => {
    router.push(`/${type}/${objectID}`);
  };
  return (
    <>
      {hits.map((hit) => (
        <ListChoice description={hit.description} title={hit.title} onClick={() => handleOnClick(type, hit.objectID)} />
      ))}
    </>
  );
};

const CustomHits = connectHits(Hits);

const Container = styled.div`
  padding-top: 10px;
`;

const SearchPage = () => {
  return (
    <InstantSearch searchClient={searchClient} indexName="wishes">
      <CustomSearchBox />
      <Index indexName="wishes">
        <Container>
          <Text weight="bold">Wishes</Text>
        </Container>

        <CustomHits type="wishes" />
        <Configure hitsPerPage={10} />
      </Index>

      <Index indexName="donations">
        <Container>
          <Text weight="bold">Donations</Text>
        </Container>

        <CustomHits type="donations" />
        <Configure hitsPerPage={10} />
      </Index>
    </InstantSearch>
  );
};

export default SearchPage;
