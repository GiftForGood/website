import React, { useRef, useState } from 'react';
import { InstantSearch, connectSearchBox, Index, Configure, connectHits } from 'react-instantsearch-dom';
import SearchBar from '../SearchBar';
import Hits from './Hits';
import algoliasearch from 'algoliasearch/lite';
import styled from 'styled-components';
import { Text, Popover } from '@kiwicom/orbit-components/lib';
import { useEffect } from 'react';
import { MAXIMUM_SEARCH } from '../../../../utils/constants/search';

const CustomSearchBox = connectSearchBox(SearchBar);
const CustomHits = connectHits(Hits);
const searchClient = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_SEARCH_KEY);

const Container = styled.div`
  padding-top: 10px;
`;

const NavSearchBar = () => {
  const inputRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const popoverOnOpen = () => {
    setIsOpen(true);
  };

  const popoverOnClose = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 150);
    }
  }, [isOpen]);

  return (
    <InstantSearch searchClient={searchClient} indexName="wishes">
      <Popover
        width="350px"
        onOpen={popoverOnOpen}
        onClose={popoverOnClose}
        content={
          <>
            <Index indexName="wishes">
              <Container>
                <Text weight="bold">Wishes</Text>
              </Container>

              <CustomHits type="wishes" />
              <Configure hitsPerPage={MAXIMUM_SEARCH} />
            </Index>

            <Index indexName="donations">
              <Container>
                <Text weight="bold">Donations</Text>
              </Container>

              <CustomHits type="donations" />
              <Configure hitsPerPage={MAXIMUM_SEARCH} />
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
