import React, { useState, useEffect } from 'react';
import api from '../../../../utils/api';
import Categories from '../modules/Categories';
import WishesFilterBy from '../modules/WishesFilterBy';
import WishCard from '../../card/WishCard';
import BlackText from '../../text/BlackText';
import SeeMoreButton from '../../buttons/SeeMoreButton';
import { Grid, Button, Loading } from '@kiwicom/orbit-components/lib';
import * as WishesSortTypeConstant from '../../../../utils/constants/wishesSortType';
import { WISHES_BATCH_SIZE } from '../../../../utils/api/constants';
import styled, { css } from 'styled-components';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';
import InfiniteScroll from 'react-infinite-scroller';
import useMediaQuery from '@kiwicom/orbit-components/lib/hooks/useMediaQuery';

// make over
import algoliasearch from 'algoliasearch/lite';
import {
  InstantSearch,
  Index,
  Configure,
  RefinementList,
  connectInfiniteHits,
  connectSortBy,
} from 'react-instantsearch-dom';
import WishesHitWrapper from '../modules/WishesHitWrapper';
import { getByCategoryIdAndStatus } from '../../../../utils/algolia/filteringRules';
import { wishesSortByRule } from '../../../../utils/algolia/sortByRules';
import WishesSortBy from '../modules/WishesSortBy';


const searchClient = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_SEARCH_KEY);
const WishesInfiniteHit = connectInfiniteHits(WishesHitWrapper);
const WishesSort = connectSortBy(WishesSortBy);

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

const PageLoadingContainer = styled.div`
  width: 100%;
  height: 100%;
  text-align: center;
  margin: 0 auto;
`;

const ButtonContainer = styled.div`
  width: 100%;
  text-align: center;
  margin-top: 20px;
`;

const GridSectionContainer = styled.div`
  margin-top: 20px;
`;

/**
 *
 * @param {string} filterQuery
 * lastActionByUserDateTime, wishesDistance, organization.name
 */
const ViewCategoryPage = ({ categoryDetails, filterQuery }) => {
  const category = categoryDetails;
  const [filter, setFilter] = useState(filterQuery ? filterQuery : WishesSortTypeConstant.TIMESTAMP); // set filter based on the filter obtained from url query
  const [allWishes, setAllWishes] = useState([]); // note that the wishes are in terms of documents, use data() to get data within
  const [shouldSeeMore, setShouldSeeMore] = useState(true);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [isDataMounted, setIsDataMounted] = useState(false); // to keep track when data is mounted on the page
  const { isLargeMobile } = useMediaQuery();

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
            <WishesSort
              items={wishesSortByRule().items}
              defaultRefinement={wishesSortByRule().defaultRefinement}
            />
          </GridSectionContainer>

          <GridSectionContainer>
            <BlackText style={{ marginBottom: '10px' }} size="large">
              {category.name}
            </BlackText>

            {/* Algolia */}
            <Configure filters={getByCategoryIdAndStatus(category.id, 'pending')} hitsPerPage={WISHES_BATCH_SIZE} />
            <WishesContainer>
              {/* Desktop,Tablet,Mobile has infinite scrolling  */}
              <WishesInfiniteHit category={category} minHitsPerPage={WISHES_BATCH_SIZE}/>
            </WishesContainer>
          </GridSectionContainer>
        </Grid>
      </ViewCategoryContainer>
    </InstantSearch>
  );
};

export default ViewCategoryPage;
