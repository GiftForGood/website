import React, { useEffect, useState } from 'react';
import api from '@api';
import DonationCard from '../../card/DonationCard';
import { Grid, Button, Loading, Stack } from '@kiwicom/orbit-components/lib';
import styled, { css } from 'styled-components';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';
import SeeMoreButtonStyle from '../../buttons/SeeMoreButton';
import BlackText from '../../text/BlackText';
import { DONATIONS_BATCH_SIZE } from '@api/constants';
import InfiniteScroll from '../../scroller/InfiniteScroller';
import useMediaQuery from '@kiwicom/orbit-components/lib/hooks/useMediaQuery';
import { getFormattedDate } from '@api/time';
import { deserializeFirestoreTimestampToUnixTimestamp } from '@utils/firebase/deserializer';
import EmptyStateImage from '@components/imageContainers/EmptyStateImage';

const GridSectionContainer = styled.div`
  margin-top: 20px;
`;

const DonationsContainer = styled.div`
  width: fit-content;
  margin: 0 auto;

  ${media.largeMobile(css`
    margin: 0;
    width: 100%;
  `)}

  ${media.tablet(css`
    margin-left: 30px;
  `)}

  ${media.desktop(css`
    margin: 0;
  `)}
`;

const ButtonContainer = styled.div`
  width: 100%;
  text-align: center;
  margin-top: 20px;
`;

const PastDonationsPanel = ({ isMine, userId }) => {
  const [pastDonations, setPastDonations] = useState([]);
  const [shouldSeeMore, setShouldSeeMore] = useState(true);
  const [pageIsLoading, setPageIsLoading] = useState(true);
  const [seeMoreIsLoading, setSeeMoreIsLoading] = useState(false);
  const { isLargeMobile } = useMediaQuery();

  const fetchPastDonations = (lastQueriedDocument) => {
    setPageIsLoading(true);
    api.donations
      .getDonorDonations(userId, lastQueriedDocument)
      .then((donationsDoc) => {
        const numberOfDocumentsReturned = donationsDoc.docs.length;
        if (numberOfDocumentsReturned < DONATIONS_BATCH_SIZE) {
          // loaded all documents already, since the number of wishes returned is less than batch size
          setShouldSeeMore(false);
        }
        setPastDonations([...pastDonations, ...donationsDoc.docs]);
        setSeeMoreIsLoading(false);
      })
      .finally(() => {
        setPageIsLoading(false);
      });
  };

  useEffect(() => {
    fetchPastDonations(null);
  }, []);

  const getLastQueriedDocument = () => {
    if (pastDonations.length === 0) {
      return null;
    }
    return pastDonations[pastDonations.length - 1];
  };

  const onSeeMoreClicked = () => {
    setSeeMoreIsLoading(true);
    fetchPastDonations(getLastQueriedDocument());
  };

  const SeeMoreButton = () => {
    return (
      <ButtonContainer>
        <Button asComponent={SeeMoreButtonStyle} loading={seeMoreIsLoading} onClick={onSeeMoreClicked}>
          <BlackText style={{ padding: '5px' }} size="medium">
            See more
          </BlackText>
        </Button>
      </ButtonContainer>
    );
  };

  const MobilePastDonations = () => {
    if (pastDonations.length === 0 && pageIsLoading) {
      return (
        <Stack justify="center" align="center" direction="column" grow>
          <Loading dataTest="test" loading text="Please wait, fetching donations..." type="pageLoader" />
        </Stack>
      );
    }

    if (pastDonations.length === 0) {
      return (
        <Stack justify="center" align="center" direction="column" grow>
          <EmptyStateImage label="No donations posted yet." />
        </Stack>
      );
    }

    return (
      <InfiniteScroll
        pageStart={0}
        loadMore={onSeeMoreClicked}
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
          <PastDonations />
        </Grid>
      </InfiniteScroll>
    );
  };

  const DesktopAndTabletPastDonations = () => {
    if (pastDonations.length === 0 && pageIsLoading) {
      return (
        <Stack justify="center" align="center" direction="column" grow>
          <Loading dataTest="test" loading text="Please wait, fetching donations..." type="pageLoader" />
        </Stack>
      );
    }

    if (pastDonations.length === 0) {
      return (
        <Stack justify="center" align="center" direction="column" grow>
          <EmptyStateImage label="No donations posted yet." />
        </Stack>
      );
    }

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
          <PastDonations />
        </Grid>

        {shouldSeeMore ? <SeeMoreButton /> : null}
      </>
    );
  };
  const PastDonations = () => {
    return pastDonations.map((pastDonation) => {
      const pastDonationData = pastDonation.data();
      deserializeFirestoreTimestampToUnixTimestamp(pastDonationData);
      const {
        donationId,
        user,
        title,
        description,
        postedDateTime,
        status,
        itemCondition,
        coverImageUrl,
        validPeriodFrom,
        validPeriodTo,
      } = pastDonationData;
      const postHref = `/donations/${donationId}`;
      const profileHref = `/profile/${user.userId}`;
      const validPeriod = `${getFormattedDate(validPeriodFrom)} - ${getFormattedDate(validPeriodTo)}`;
      return (
        <DonationCard
          key={donationId}
          name={user.userName}
          title={title}
          description={description}
          profileImageUrl={user.profileImageUrl}
          postedDateTime={postedDateTime}
          postHref={postHref}
          profileHref={profileHref}
          coverImageUrl={coverImageUrl}
          status={status}
          validPeriod={validPeriod}
          itemCondition={itemCondition}
        />
      );
    });
  };

  return (
    <div>
      <GridSectionContainer>
        <DonationsContainer>
          {isLargeMobile ? <DesktopAndTabletPastDonations /> : <MobilePastDonations />}
        </DonationsContainer>
      </GridSectionContainer>
    </div>
  );
};

export default PastDonationsPanel;
