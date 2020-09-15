import React, { useState } from 'react';
import Categories from '../modules/Categories';
import BlackText from '../../text/BlackText';
import { Grid } from '@kiwicom/orbit-components/lib';
import { WISHES_BATCH_SIZE } from '@api/constants';
import styled, { css } from 'styled-components';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';
import { InstantSearch, Configure, connectInfiniteHits } from 'react-instantsearch-dom';
import WishesHitWrapper from '../modules/WishesHitWrapper';
import { getByCategoryIdAndStatusAndNotExpired } from '@utils/algolia/filteringRules';
import { wishesSortByRule } from '@utils/algolia/sortByRules';
import dynamic from 'next/dynamic';
import { searchClient } from '@utils/algolia';

const WishesSortFilterPanel = dynamic(() => import('../modules/WishesSortFilterPanel'), {
  ssr: false,
});

const WishesInfiniteHit = connectInfiniteHits(WishesHitWrapper);

const ViewCategoryContainer = styled.div`
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

/**
 *
 * @param {string} sortByQuery
 * wishes, wishes_npo_name_asc, wishes_npo_name_desc
 */
const ViewCategoryPage = ({ categoryDetails, sortByQuery }) => {
  const category = categoryDetails;
  const [sortBy, setSortBy] = useState(sortByQuery ? sortByQuery : wishesSortByRule().defaultRefinement);
  const [latLngFilter, setLatLngFilter] = useState('');

  const onLatLngUpdated = (latLng) => {
    setLatLngFilter(latLng);
  };

  return (
    <InstantSearch searchClient={searchClient} indexName="wishes">
      <ViewCategoryContainer>
        <Categories type="wishes" />

        <Grid
          columnGap="20px"
          desktop={{
            columns: '1fr 6fr',
          }}
          rows="1fr auto"
        >
          <GridSectionContainer>
            <WishesSortFilterPanel
              sortItems={wishesSortByRule().items}
              sortDefaultRefinement={sortBy}
              category={category}
              onLatLngUpdated={onLatLngUpdated}
            />
          </GridSectionContainer>

          <GridSectionContainer>
            <BlackText style={{ marginBottom: '10px' }} size="large">
              {category.name}
            </BlackText>

            {/* Algolia */}
            <Configure
              filters={getByCategoryIdAndStatusAndNotExpired(category.id, 'pending', Date.now())}
              hitsPerPage={WISHES_BATCH_SIZE}
              aroundLatLng={latLngFilter}
              aroundRadius={10000}
            />
            <WishesContainer>
              {/* Desktop,Tablet,Mobile has infinite scrolling  */}
              <WishesInfiniteHit category={category} minHitsPerPage={WISHES_BATCH_SIZE} />
            </WishesContainer>
          </GridSectionContainer>
        </Grid>
      </ViewCategoryContainer>
    </InstantSearch>
  );
};

export default ViewCategoryPage;
