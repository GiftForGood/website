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
import { wishesSortByRule } from '@utils/algolia/sortByRules';
import { getByStatusAndNotExpired } from '@utils/algolia/filteringRules';
import { WISHES_BATCH_SIZE } from '@api/constants';

// dynamic imports
const WishesSortFilterPanel = dynamic(() => import('../components/SortFilterPanel'), {
  ssr: false,
});

const WishesInfiniteHit = connectInfiniteHits(HitWrapper);

const ViewAllWishesContainer = styled(MaxWidthContainer)`
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

const ViewAllWishesPage = ({ sortByQuery, query = '' }) => {
  const user = useUser();
  const [sortBy, setSortBy] = useState(sortByQuery ? sortByQuery : wishesSortByRule().defaultRefinement);
  const category = {
    id: '',
    name: 'All wishes',
  };
  const [latLngFilter, setLatLngFilter] = useState('');

  const onLatLngUpdated = (latLng) => {
    setLatLngFilter(latLng);
  };

  return (
    <InstantSearch searchClient={searchClient} indexName="wishes">
      <ViewAllWishesContainer>
        <Categories type="wishes" />

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
            <WishesSortFilterPanel
              sortItems={wishesSortByRule().items}
              sortDefaultRefinement={sortBy}
              category={null}
              onLatLngUpdated={onLatLngUpdated}
            />
          </GridSectionContainer>

          <GridSectionContainer>
            <BlackText style={{ marginBottom: '10px' }} size="large">
              All Wishes
            </BlackText>

            {/* Algolia */}
            <Configure
              filters={getByStatusAndNotExpired('pending', Date.now())}
              hitsPerPage={WISHES_BATCH_SIZE}
              query={query}
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
      </ViewAllWishesContainer>
    </InstantSearch>
  );
};

export default ViewAllWishesPage;
