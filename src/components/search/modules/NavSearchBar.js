import React, { useRef, useEffect } from 'react';
import { InstantSearch, connectSearchBox, Index, Configure, connectHits } from 'react-instantsearch-dom';
import SearchBar from '../SearchBar';
import Hits from './Hits';
import algoliasearch from 'algoliasearch/lite';
import styled from 'styled-components';
import { Text, Popover } from '@kiwicom/orbit-components/lib';

const CustomSearchBox = connectSearchBox(SearchBar);
const CustomHits = connectHits(Hits);
const searchClient = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_ADMIN_KEY);

const Container = styled.div`
  padding-top: 10px;
`;

const NavSearchBar = () => {
  const inputRef = useRef(null);

  const popoverOnOpen = () => {
    setTimeout(() => {
      inputRef.current.focus();
    }, 150);
  };

  return (
    <InstantSearch searchClient={searchClient} indexName="wishes">
      <Popover
        width="350px"
        onOpen={popoverOnOpen}
        content={
          <>
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
          </>
        }
      >
        <CustomSearchBox inputRef={inputRef} />
      </Popover>
    </InstantSearch>
  );
};

export default NavSearchBar;
