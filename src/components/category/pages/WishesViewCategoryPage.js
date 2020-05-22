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

const ViewCategoryPage = ({ categoryDetails, filterQuery }) => {
  const category = categoryDetails;
  const [filter, setFilter] = useState(filterQuery ? filterQuery : WishesSortTypeConstant.TIMESTAMP); // set filter based on the filter obtained from url query
  const [allWishes, setAllWishes] = useState([]); // note that the wishes are in terms of documents, use data() to get data within
  const [hasAllLoaded, setHasAllLoaded] = useState(false);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const { isLargeMobile } = useMediaQuery();

  /**
   * Toggled whenever filter changes, reset everything and get first batch of wishes with filter
   */
  useEffect(() => {
    if (allWishes.length > 0) {
      // only set page loading to true when filter is modified
      setAllWishes([]);
      setIsPageLoading(true);
      setHasAllLoaded(false);
    }
    getNextBatchOfWishes(category.id, filter, null).then((newWishes) => {
      setAllWishes(newWishes);
      setIsPageLoading(false);
    });
  }, [filter]);

  const getLastQueriedDocument = () => {
    if (allWishes.length === 0) {
      return null;
    }
    return allWishes[allWishes.length - 1];
  };

  /**
   * Note that this function returns WISHES_BATCH_SIZE - 1 amount of documents,
   * instead of WISHES_BATCH_SIZE, as the last document is to check whether we
   * have loaded all wishes.
   */
  const getNextBatchOfWishes = async (categoryId, filter, lastQueriedDocument) => {
    // only time stamp should be reversed as it is from newest to oldest
    const isReverse = filter === WishesSortTypeConstant.TIMESTAMP ? true : false;
    const rawWishes = await api.wishes
      .getPendingWishesForCategory(categoryId, filter, isReverse, lastQueriedDocument)
      .catch((err) => console.error(err));
    const numberOfDocumentsReturned = rawWishes.docs.length;
    if (numberOfDocumentsReturned < WISHES_BATCH_SIZE) {
      // loaded all documents already, since the number of wishes returned is less than batch size
      setHasAllLoaded(true);
      return rawWishes.docs;
    }
    return rawWishes.docs.slice(0, WISHES_BATCH_SIZE - 1);
  };

  const displayAllWishes = () => {
    if (allWishes.length === 0) {
      return;
    }
    return allWishes.map((wish) => {
      const { wishesId, categories, organization, title, description, user, postedDateTime, isBumped } = wish.data();
      const postHref = `/wishes/${wishesId}`;
      const categoryTags = categories.map((category) => category.name);
      return (
        <WishCard
          key={wishesId}
          name={organization.name}
          title={title}
          description={description}
          profileImageUrl={user.profileImageUrl}
          postedDateTime={postedDateTime}
          postHref={postHref}
          categoryTags={categoryTags}
          isBumped={isBumped}
        />
      );
    });
  };

  const handleOnClickSeeMore = () => {
    setIsButtonLoading(true);
    getNextBatchOfWishes(category.id, filter, getLastQueriedDocument()).then((newWishes) => {
      if (newWishes.length > 0) {
        setAllWishes(allWishes.concat(newWishes));
      }
      setIsButtonLoading(false);
    });
  };

  const DesktopAndTabletWishes = () => {
    return (
      <>
        <Grid
          inline={true}
          largeDesktop={{
            columns: '1fr 1fr 1fr',
          }}
          largeMobile={{
            columns: '1fr 1fr',
          }}
          rows="auto"
          gap="20px"
        >
          {displayAllWishes()}
        </Grid>
        {isPageLoading && (
          <PageLoadingContainer>
            <Loading loading={isPageLoading} type="pageLoader" />
          </PageLoadingContainer>
        )}
        <br />
        {!hasAllLoaded && (
          <ButtonContainer>
            <Button asComponent={SeeMoreButton} onClick={handleOnClickSeeMore} loading={isButtonLoading}>
              <BlackText style={{ padding: '5px' }} size="medium">
                See more
              </BlackText>
            </Button>
          </ButtonContainer>
        )}
      </>
    );
  };

  const MobileWishes = () => {
    return (
      <InfiniteScroll
        pageStart={0}
        loadMore={handleOnClickSeeMore}
        hasMore={!hasAllLoaded}
        loader={<Loading type="pageLoader" key={0} />}
      >
        <Grid
          inline={true}
          largeMobile={{
            columns: '1fr 1fr',
          }}
          rows="auto"
          gap="20px"
          columns="1fr"
        >
          {displayAllWishes()}
        </Grid>
      </InfiniteScroll>
    );
  };

  return (
    <ViewCategoryContainer>
      <Categories />
      <Grid
        columnGap="20px"
        tablet={{
          columns: '1fr 6fr',
        }}
        rows="1fr auto"
      >
        <GridSectionContainer>
          <WishesFilterBy category={category} filter={filter} setFilter={setFilter} />
        </GridSectionContainer>
        <GridSectionContainer>
          <BlackText style={{ marginBottom: '10px' }} size="large">
            {category.name}
          </BlackText>
          <WishesContainer>{isLargeMobile ? <DesktopAndTabletWishes /> : <MobileWishes />}</WishesContainer>
        </GridSectionContainer>
      </Grid>
    </ViewCategoryContainer>
  );
};

export default ViewCategoryPage;
