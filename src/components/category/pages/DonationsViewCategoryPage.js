import React, { useState, useEffect } from 'react';
import api from '../../../../utils/api';
import Categories from '../modules/Categories';
import DonationsFilterBy from '../modules/DonationsFilterBy';
import DonationCard from '../../card/DonationCard';
import BlackText from '../../text/BlackText';
import SeeMoreButton from '../../buttons/SeeMoreButton';
import { Grid, Button, Loading } from '@kiwicom/orbit-components/lib';
import * as DonationsSortTypeConstant from '../../../../utils/constants/donationsSortType';
import { DONATIONS_BATCH_SIZE } from '../../../../utils/api/constants';
import { getFormattedDate } from '../../../../utils/api/time';
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

const DonationsContainer = styled.div`
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
  const [filter, setFilter] = useState(filterQuery ? filterQuery : DonationsSortTypeConstant.TIMESTAMP); // set filter based on the filter obtained from url query
  const [allDonations, setAllDonations] = useState([]); // note that the donations are in terms of documents, use data() to get data within
  const [shouldSeeMore, setShouldSeeMore] = useState(true);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [isDataMounted, setIsDataMounted] = useState(false); // to keep track when data is mounted on the page
  const { isLargeMobile } = useMediaQuery();

  /**
   * Toggled whenever filter changes, reset everything and get first batch of donations with filter
   */
  useEffect(() => {
    setIsDataMounted(false);
    if (allDonations.length > 0) {
      // only set page loading to true when filter is modified
      setAllDonations([]);
      setIsPageLoading(true);
      setShouldSeeMore(true);
    }
    getNextBatchOfDonations(category.id, filter, null).then((newDonations) => {
      const numberOfDocumentsReturned = newDonations.length;
      if (numberOfDocumentsReturned < DONATIONS_BATCH_SIZE) {
        // loaded all documents already, since the number of donations returned is less than batch size
        setShouldSeeMore(false);
      }
      setAllDonations(newDonations);
      setIsPageLoading(false);
      setIsDataMounted(true); // to show see more button & no donation message after page is mounted
    });
  }, [filter]);

  const getLastQueriedDocument = () => {
    if (allDonations.length === 0) {
      return null;
    }
    return allDonations[allDonations.length - 1];
  };

  const getNextBatchOfDonations = async (categoryId, filter, lastQueriedDocument) => {
    // only time stamp should be reversed as it is from newest to oldest
    const isReverse = filter === DonationsSortTypeConstant.TIMESTAMP ? true : false;
    const rawDonations = await api.donations
      .getPendingDonationsForCategory(categoryId, filter, isReverse, lastQueriedDocument)
      .catch((err) => console.error(err));
    return rawDonations.docs;
  };

  const displayAllDonations = () => {
    if (allDonations.length === 0) {
      return isDataMounted && <BlackText size="medium">No donations found.</BlackText>;
    }
    return allDonations.map((donation) => {
      const {
        donationId,
        coverImageUrl,
        title,
        description,
        user,
        postedDateTime,
        locations,
        validPeriodFrom,
        validPeriodTo,
      } = donation.data();
      const postHref = `/donations/${donationId}`;
      const validPeriod = `${getFormattedDate(validPeriodFrom)} - ${getFormattedDate(validPeriodTo)}`;
      return (
        <DonationCard
          key={donationId}
          name={user.userName}
          title={title}
          description={description}
          profileImageUrl={user.profileImageUrl}
          coverImageUrl={coverImageUrl}
          postedDateTime={postedDateTime}
          postHref={postHref}
          locations={locations.map((location) => location.name).join(', ')}
          validPeriod={validPeriod}
          categoryId={category.id}
          categoryName={category.name}
        />
      );
    });
  };

  const handleOnClickSeeMore = () => {
    setIsButtonLoading(true);
    getNextBatchOfDonations(category.id, filter, getLastQueriedDocument()).then((newDonations) => {
      const numberOfDocumentsReturned = newDonations.length;
      if (numberOfDocumentsReturned < DONATIONS_BATCH_SIZE) {
        // loaded all documents already, since the number of donations returned is less than batch size
        setShouldSeeMore(false);
      }
      if (numberOfDocumentsReturned > 0) {
        setAllDonations(allDonations.concat(newDonations));
      }
      setIsButtonLoading(false);
    });
  };

  const DesktopAndTabletDonations = () => {
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
          {displayAllDonations()}
        </Grid>
        {isPageLoading && (
          <PageLoadingContainer>
            <Loading loading={isPageLoading} type="pageLoader" />
          </PageLoadingContainer>
        )}
        <br />
        {shouldSeeMore && isDataMounted && (
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

  const MobileDonations = () => {
    return (
      <InfiniteScroll
        pageStart={0}
        loadMore={handleOnClickSeeMore}
        hasMore={shouldSeeMore}
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
          {displayAllDonations()}
        </Grid>
      </InfiniteScroll>
    );
  };

  return (
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
          <DonationsFilterBy category={category} filter={filter} setFilter={setFilter} />
        </GridSectionContainer>
        <GridSectionContainer>
          <BlackText style={{ marginBottom: '10px' }} size="large">
            {category.name}
          </BlackText>
          <DonationsContainer>{isLargeMobile ? <DesktopAndTabletDonations /> : <MobileDonations />}</DonationsContainer>
        </GridSectionContainer>
      </Grid>
    </ViewCategoryContainer>
  );
};

export default ViewCategoryPage;
