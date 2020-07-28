import React, { useState, useEffect } from 'react';
import Categories from '../modules/Categories';
import BlackText from '../../text/BlackText';
import { Grid, Stack, Collapse } from '@kiwicom/orbit-components/lib';
import * as DonationsSortTypeConstant from '../../../../utils/constants/donationsSortType';
import { DONATIONS_BATCH_SIZE } from '../../../../utils/api/constants';
import styled, { css } from 'styled-components';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, Configure, connectInfiniteHits, connectSortBy } from 'react-instantsearch-dom';
import DonationsHitWrapper from '../modules/DonationsHitWrapper';
import { getByCategoryIdAndStatus } from '../../../../utils/algolia/filteringRules';
import { donationsSortByRule } from '../../../../utils/algolia/sortByRules';
import DonationsSortBy from '../modules/DonationsSortBy';
import DonationsFilterby from '../modules/DonationsFilterBy';
import Desktop from '@kiwicom/orbit-components/lib/Desktop';
import Mobile from '@kiwicom/orbit-components/lib/Mobile';

const searchClient = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_SEARCH_KEY);
const DonationsInfiniteHit = connectInfiniteHits(DonationsHitWrapper);
const DonationsSort = connectSortBy(DonationsSortBy);

const ViewCategoryContainer = styled.div`
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

const ViewCategoryPage = ({ categoryDetails, sortByQuery }) => {
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
            <Desktop>
              <Stack>
                <DonationsSort items={donationsSortByRule().items} defaultRefinement={sortBy} category={category} />
                <DonationsFilterby onLatLngUpdated={onLatLngUpdated} />
              </Stack>
            </Desktop>

            <Mobile>
              <Collapse label="Filter/Sort Settings">
                <Stack>
                  <DonationsSort items={donationsSortByRule().items} defaultRefinement={sortBy} category={category} />
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
              filters={getByCategoryIdAndStatus(category.id, 'pending')}
              hitsPerPage={DONATIONS_BATCH_SIZE}
              aroundLatLng={latLngFilter}
              aroundRadius={10000}
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
