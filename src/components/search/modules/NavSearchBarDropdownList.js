import React, { useRef, useState } from 'react';
import { InstantSearch, connectSearchBox, Index, Configure, connectHits } from 'react-instantsearch-dom';
import SearchBar from './AlgoliaSearchBar';
import Hits from './Hits';
import algoliasearch from 'algoliasearch/lite';
import styled from 'styled-components';
import { Text } from '@kiwicom/orbit-components/lib';
import { MAXIMUM_SEARCH_DESKTOP } from '../../../../utils/constants/search';
import Popover from 'react-tiny-popover';

const CustomSearchBox = connectSearchBox(SearchBar);
const CustomHits = connectHits(Hits);
const searchClient = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_SEARCH_KEY);

const Container = styled.div`
  padding-top: 10px;
`;

const ContentContainer = styled.div`
  background: white;
  padding: 0px 10px 8px 10px;
`;

const NavSearchBar = () => {
  const inputRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <InstantSearch searchClient={searchClient} indexName="wishes">
      <Popover
        isOpen={isOpen}
        position={['bottom']}
        disableReposition
        onClickOutside={() => setIsOpen(false)}
        containerStyle={{
          zIndex: 1000,
          width: '350px',
          boxShadow: '0 8px 13px 0 rgba(44, 44, 45, 0.27)',
          borderRadius: '5px',
          position: 'fixed',
        }}
        align="start"
        transitionDuration={0.1}
        content={({ position, nudgedLeft, nudgedTop, targetRect, popoverRect }) => {
          return (
            <ContentContainer>
              <>
                <Index indexName="wishes">
                  <Container>
                    <Text weight="bold">Wishes</Text>
                  </Container>

                  <CustomHits type="wishes" />
                  <Configure hitsPerPage={MAXIMUM_SEARCH_DESKTOP} />
                </Index>

                <Index indexName="donations">
                  <Container>
                    <Text weight="bold">Donations</Text>
                  </Container>

                  <CustomHits type="donations" />
                  <Configure hitsPerPage={MAXIMUM_SEARCH_DESKTOP} />
                </Index>
              </>
            </ContentContainer>
          );
        }}
      >
        <div onClick={() => setIsOpen(true)}>
          <CustomSearchBox inputRef={inputRef} />
        </div>
      </Popover>
    </InstantSearch>
  );
};

export default NavSearchBar;
