import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';
import dynamic from 'next/dynamic';

// components
import { MaxWidthContainer } from '@components/containers';
import { HitWrapper } from '../components';
import { InstantSearch, Configure, connectInfiniteHits } from 'react-instantsearch-dom';
import { Grid } from '@kiwicom/orbit-components/lib';
import BlackText from '@components/text/BlackText';
import { Categories } from '../../components';

// hooks
import useUser from '@components/session/modules/useUser';

// utils and constants
import { searchClient } from '@utils/algolia';
import { donationsSortByRule } from '@utils/algolia/sortByRules';
import { getByStatus } from '@utils/algolia/filteringRules';
import { DONATIONS_BATCH_SIZE } from '@api/constants';

// dynamic imports
const DonationsSortFilterPanel = dynamic(() => import('../components/SortFilterPanel'), {
  ssr: false,
});

const DonationsInfiniteHit = connectInfiniteHits(HitWrapper);

const ViewAllDonationsContainer = styled(MaxWidthContainer)`
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

const ViewAllDonationsPage = ({ sortByQuery, query = '' }) => {
  const user = useUser();
  const [sortBy, setSortBy] = useState(sortByQuery ? sortByQuery : donationsSortByRule().defaultRefinement);
  const category = {
    id: '',
    name: 'All donations',
  };
  const [latLngFilter, setLatLngFilter] = useState('');

  const onLatLngUpdated = (latLng) => {
    setLatLngFilter(latLng);
  };

  return (
    <InstantSearch searchClient={searchClient} indexName="donations">
      <ViewAllDonationsContainer>
        <Categories type="donations" />

        <BlackText style={{ marginTop: '10px' }} size="large">
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
            <DonationsSortFilterPanel
              sortItems={donationsSortByRule().items}
              sortDefaultRefinement={sortBy}
              category={null}
              onLatLngUpdated={onLatLngUpdated}
            />
          </GridSectionContainer>

          <GridSectionContainer>
            <BlackText style={{ marginBottom: '10px' }} size="large">
              {category.name}
            </BlackText>

            {/* Algolia */}
            <Configure
              filters={getByStatus('pending')}
              hitsPerPage={DONATIONS_BATCH_SIZE}
              query={query}
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
      </ViewAllDonationsContainer>
    </InstantSearch>
  );
};

export default ViewAllDonationsPage;
