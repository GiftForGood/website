import React from 'react';
import styled, { css } from 'styled-components';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';
import dynamic from 'next/dynamic';

// components
import BlackText from '@components/text/BlackText';
import { Grid } from '@kiwicom/orbit-components/lib';
import { InstantSearch, Configure, connectInfiniteHits } from 'react-instantsearch-dom';
import { WishesHitWrapper } from './components';
import { MaxWidthContainer } from '@components/containers';

// constants and utils
import { WISHES_BATCH_SIZE } from '@api/constants';
import { getNpoWishes } from '@utils/algolia/filteringRules';
import { wishesSortByRule } from '@utils/algolia/sortByRules';
import { searchClient } from '@utils/algolia';

// hooks
import useUser from '@components/session/modules/useUser';

const WishesSortFilterPanel = dynamic(() => import('./components/OrgWishesSortFilterPanel'), {
  ssr: false,
});

const WishesInfiniteHit = connectInfiniteHits(WishesHitWrapper);

const ViewAllWishesContainer = styled(MaxWidthContainer)`
  margin-top: 25px;
  margin-bottom: 40px;
`;

const GridSectionContainer = styled.div`
  margin-top: 20px;
`;

const WishesContainer = styled.div`
  width: fit-content;
  margin: 0 auto;

  ${media.largeMobile(css`
    margin: 0;
    width: 100%;
  `)};
`;

const OrganizationWishes = ({ organization }) => {
  const user = useUser();
  const category = {
    id: '',
    name: 'All wishes',
  };

  return (
    <InstantSearch searchClient={searchClient} indexName="wishes">
      <ViewAllWishesContainer>
        <Grid
          columnGap="20px"
          desktop={{
            columns: '1fr 6fr',
          }}
          rows="1fr auto"
        >
          <GridSectionContainer>
            <WishesSortFilterPanel category={null} />
          </GridSectionContainer>

          <GridSectionContainer>
            <BlackText style={{ marginBottom: '10px' }} size="large">
              All Wishes
            </BlackText>

            {/* Algolia */}
            <Configure
              filters={getNpoWishes(organization.id)}
              hitsPerPage={WISHES_BATCH_SIZE}
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

export default OrganizationWishes;
