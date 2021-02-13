import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';
import dynamic from 'next/dynamic';

// components
import { Grid } from '@kiwicom/orbit-components/lib';
import { InstantSearch, Configure, connectInfiniteHits } from 'react-instantsearch-dom';
import BlackText from '@components/text/BlackText';
import { NposHitWrapper } from './components';
import { MaxWidthContainer } from '@components/containers';

// constants and utils
import { nposSortByRule } from '@utils/algolia/sortByRules';
import { getNpoNotBlocked } from '@utils/algolia/filteringRules';
import { searchClient } from '@utils/algolia';
import { NPOS_BATCH_SIZE } from '@constants/npos';

// dynamic imports
const NposSortFilterPanel = dynamic(() => import('./components/NposSortFilterPanel'), {
  ssr: false,
});

const NposInfiniteHit = connectInfiniteHits(NposHitWrapper);

const Container = styled(MaxWidthContainer)`
  margin-top: 25px;
`;

const UsersContainer = styled.div`
  width: fit-content;
  margin: 0 auto;
  ${media.largeMobile(css`
    margin: 0;
    width: 100%;
  `)}
`;

const GridSectionContainer = styled.div`
  margin-top: 20px;
`;

const NposPage = ({ sortByQuery, query = '' }) => {
  const [sortBy, setSortBy] = useState(sortByQuery ? sortByQuery : nposSortByRule().defaultRefinement);

  return (
    <InstantSearch searchClient={searchClient} indexName="wishes">
      <Container>
        <BlackText style={{ marginTop: '20px' }} size="large">
          {query ? `Search results for "${query}"` : null}
        </BlackText>
        <Grid
          columnGap="20px"
          desktop={{
            columns: '1fr 6fr',
          }}
          rows="1fr auto"
        >
          <GridSectionContainer>
            <NposSortFilterPanel sortItems={nposSortByRule().items} sortDefaultRefinement={sortBy} query={query} />
          </GridSectionContainer>

          <GridSectionContainer>
            <BlackText style={{ marginBottom: '10px' }} size="large">
              All NPOs
            </BlackText>

            {/* Algolia */}
            <Configure filters={getNpoNotBlocked()} hitsPerPage={NPOS_BATCH_SIZE} query={query} />
            <UsersContainer>
              {/* Desktop,Tablet,Mobile has infinite scrolling  */}
              <NposInfiniteHit minHitsPerPage={NPOS_BATCH_SIZE} />
            </UsersContainer>
          </GridSectionContainer>
        </Grid>
      </Container>
    </InstantSearch>
  );
};

export default NposPage;
