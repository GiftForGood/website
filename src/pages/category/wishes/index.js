import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';
import dynamic from 'next/dynamic';

// components
import { MaxWidthContainer } from '@components/containers';
import { HitWrapper } from './components';
import { InstantSearch, Configure, connectInfiniteHits } from 'react-instantsearch-dom';
import { Grid } from '@kiwicom/orbit-components/lib';
import BlackText from '@components/text/BlackText';
import { Categories } from '../components';

// hooks
import useUser from '@components/session/modules/useUser';

// utils and components
import { searchClient } from '@utils/algolia';
import { wishesSortByRule } from '@utils/algolia/sortByRules';
import { getByCategoryIdAndStatusAndNotExpired } from '@utils/algolia/filteringRules';
import { WISHES_BATCH_SIZE } from '@api/constants';

// dynamic imports
const WishesSortFilterPanel = dynamic(() => import('./components/SortFilterPanel'), {
  ssr: false,
});

const WishesInfiniteHit = connectInfiniteHits(HitWrapper);

const ViewCategoryContainer = styled(MaxWidthContainer)`
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
  const user = useUser();
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
              enablePersonalization={true}
              userToken={user?.userId}
              clickAnalytics={true}
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
