import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';
import dynamic from 'next/dynamic';

// components
import { MaxWidthContainer } from '@components/containers';
import { HitWrapper } from './components';
import { Grid } from '@kiwicom/orbit-components/lib';
import BlackText from '@components/text/BlackText';
import { Categories } from '../components';
import { InstantSearch, Configure, connectInfiniteHits } from 'react-instantsearch-dom';

// hooks
import useUser from '@components/session/modules/useUser';

// utils and constants
import { donationsSortByRule } from '@utils/algolia/sortByRules';
import { getByCategoryIdAndStatus } from '@utils/algolia/filteringRules';
import { DONATIONS_BATCH_SIZE } from '@api/constants';
import { searchClient } from '@utils/algolia';

// dynamic imports
const DonationsSortFilterPanel = dynamic(() => import('./components/SortFilterPanel'), {
  ssr: false,
});

const DonationsInfiniteHit = connectInfiniteHits(HitWrapper);

const ViewCategoryContainer = styled(MaxWidthContainer)`
  margin-top: 25px;
  margin-bottom: 40px;
`;

const DonationsContainer = styled.div`
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

const ViewCategoryPage = ({ categoryDetails, sortByQuery }) => {
  const user = useUser();
  const category = categoryDetails;
  const [sortBy, setSortBy] = useState(sortByQuery ? sortByQuery : donationsSortByRule().defaultRefinement);
  const [latLngFilter, setLatLngFilter] = useState('');

  const onLatLngUpdated = (latLng) => {
    setLatLngFilter(latLng);
  };

  return (
    <InstantSearch searchClient={searchClient} indexName="donations">
      <ViewCategoryContainer>
        <Categories type="donations" />

        <Grid
          columnGap="20px"
          desktop={{
            columns: '1fr 6fr',
          }}
          rows="1fr auto"
        >
          <GridSectionContainer>
            <DonationsSortFilterPanel
              sortItems={donationsSortByRule().items}
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
              filters={getByCategoryIdAndStatus(category.id, 'pending')}
              hitsPerPage={DONATIONS_BATCH_SIZE}
              aroundLatLng={latLngFilter}
              aroundRadius={10000}
              enablePersonalization={true}
              userToken={user?.userId}
              clickAnalytics={true}
            />
            <DonationsContainer>
              {/* Desktop,Tablet,Mobile has infinite scrolling  */}
              <DonationsInfiniteHit category={category} minHitsPerPage={DONATIONS_BATCH_SIZE} />
            </DonationsContainer>
          </GridSectionContainer>
        </Grid>
      </ViewCategoryContainer>
    </InstantSearch>
  );
};

export default ViewCategoryPage;
