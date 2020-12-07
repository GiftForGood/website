import React, { useState, useEffect } from 'react';
import BlackText from '@components/text/BlackText';
import { Grid } from '@kiwicom/orbit-components/lib';
import { WISHES_BATCH_SIZE } from '@api/constants';
import styled, { css } from 'styled-components';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';
import { InstantSearch, Configure, connectInfiniteHits } from 'react-instantsearch-dom';
import WishesHitWrapper from '@components/category/modules/WishesHitWrapper';
import { getNpoWishes } from '@utils/algolia/filteringRules';
import { wishesSortByRule } from '@utils/algolia/sortByRules';
import dynamic from 'next/dynamic';
import useUser from '@components/session/modules/useUser';
import { searchClient } from '@utils/algolia';
import { MaxWidthContainer } from '@components/containers';

const WishesSortFilterPanel = dynamic(() => import('@components/organization/modules/OrgWishesSortFilterPanel'), {
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
