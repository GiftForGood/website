import React, { useState, useEffect } from 'react';
import Categories from '../modules/Categories';
import BlackText from '../../text/BlackText';
import { Grid } from '@kiwicom/orbit-components/lib';
import { WISHES_BATCH_SIZE } from '../../../../utils/api/constants';
import styled, { css } from 'styled-components';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, Configure, connectInfiniteHits, connectSortBy } from 'react-instantsearch-dom';
import WishesHitWrapper from '../modules/WishesHitWrapper';
import { getByStatus } from '../../../../utils/algolia/filteringRules';
import { wishesSortByRule } from '../../../../utils/algolia/sortByRules';
import WishesSortBy from '../modules/WishesSortBy';

const searchClient = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_SEARCH_KEY);
const WishesInfiniteHit = connectInfiniteHits(WishesHitWrapper);
const WishesSort = connectSortBy(WishesSortBy);

const ViewAllWishesContainer = styled.div`
  width: 90vw;
  max-width: 1280px;
  margin: 0 auto;
  margin-top: 25px;
  margin-bottom: 40px;
`;

const WishesContainer = styled.div`
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

const ViewAllWishesPage = ({ sortByQuery }) => {
  const [sortBy, setSortBy] = useState(sortByQuery ? sortByQuery : wishesSortByRule().defaultRefinement);
  const category = {
    id: '',
    name: "All wishes"
  };

  return (
    <InstantSearch searchClient={searchClient} indexName="wishes">
      <ViewAllWishesContainer>
        <Categories type="wishes" />

        <Grid
          columnGap="20px"
          desktop={{
            columns: '1fr 6fr',
          }}
          rows="1fr auto"
        >
          <GridSectionContainer>
            <WishesSort
              items={wishesSortByRule().items}
              defaultRefinement={sortBy}
              category={null}
            />
          </GridSectionContainer>

          <GridSectionContainer>
            <BlackText style={{ marginBottom: '10px' }} size="large">
              All Wishes
            </BlackText>

            {/* Algolia */}
            <Configure filters={getByStatus('pending')} hitsPerPage={WISHES_BATCH_SIZE} />
            <WishesContainer>
              {/* Desktop,Tablet,Mobile has infinite scrolling  */}
              <WishesInfiniteHit category={category} minHitsPerPage={WISHES_BATCH_SIZE} />
            </WishesContainer>
          </GridSectionContainer>
        </Grid>
      </ViewAllWishesContainer>
    </InstantSearch>
  );
};

export default ViewAllWishesPage;
