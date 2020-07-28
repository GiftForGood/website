import React, { useState } from 'react';
import Categories from '../modules/Categories';
import BlackText from '../../text/BlackText';
import { Grid, Stack, Collapse } from '@kiwicom/orbit-components/lib';
import { DONATIONS_BATCH_SIZE } from '../../../../utils/api/constants';
import styled, { css } from 'styled-components';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, Configure, connectInfiniteHits, connectSortBy } from 'react-instantsearch-dom';
import DonationsHitWrapper from '../modules/DonationsHitWrapper';
import { getByStatus } from '../../../../utils/algolia/filteringRules';
import { donationsSortByRule } from '../../../../utils/algolia/sortByRules';
import DonationsSortBy from '../modules/DonationsSortBy';
import DonationsFilterby from '../modules/DonationsFilterBy';
import Desktop from '@kiwicom/orbit-components/lib/Desktop';
import Mobile from '@kiwicom/orbit-components/lib/Mobile';

const searchClient = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_SEARCH_KEY);
const DonationsInfiniteHit = connectInfiniteHits(DonationsHitWrapper);
const DonationsSort = connectSortBy(DonationsSortBy);

const ViewAllDonationsContainer = styled.div`
  width: 90vw;
  max-width: 1280px;
  margin: 0 auto;
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
            <Desktop>
              <Stack>
                <DonationsSort items={donationsSortByRule().items} defaultRefinement={sortBy} category={null} />
                <DonationsFilterby onLatLngUpdated={onLatLngUpdated} />
              </Stack>
            </Desktop>

            <Mobile>
              <Collapse label="Filter/Sort Settings">
                <Stack>
                  <DonationsSort items={donationsSortByRule().items} defaultRefinement={sortBy} category={null} />
                  <DonationsFilterby onLatLngUpdated={onLatLngUpdated} />
                </Stack>
              </Collapse>
            </Mobile>
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
