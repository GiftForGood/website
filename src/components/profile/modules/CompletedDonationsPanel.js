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

const CompletedDonationsPanel = ({ isMine, userId }) => {
  const [completedDonations, setCompletedDonations] = useState([]);
  const [shouldSeeMore, setShouldSeeMore] = useState(true);
  const [pageIsLoading, setPageIsLoading] = useState(true);
  const [seeMoreIsLoading, setSeeMoreIsLoading] = useState(false);
  const { isLargeMobile } = useMediaQuery();

  const fetchCompletedDonations = (lastQueriedDocument) => {
    setPageIsLoading(true);
    api.donations
      .getNPOCompletedDonations(userId, lastQueriedDocument)
      .then((donationDoc) => {
        const numberOfDocumentsReturned = donationDoc.docs.length;
        if (numberOfDocumentsReturned < DONATIONS_BATCH_SIZE) {
          // loaded all documents already, since the number of donations returned is less than batch size
          setShouldSeeMore(false);
        }
        setCompletedDonations([...completedDonations, ...donationDoc.docs]);
        setSeeMoreIsLoading(false);
      })
      .finally(() => {
        setPageIsLoading(false);
      });
  };

  useEffect(() => {
    fetchCompletedDonations(null);
  }, []);

  const getLastQueriedDocument = () => {
    if (completedDonations.length === 0) {
      return null;
    }
    return completedDonations[completedDonations.length - 1];
  };

  const onSeeMoreClicked = () => {
    setSeeMoreIsLoading(true);
    fetchCompletedDonations(getLastQueriedDocument());
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

  const MobileCompletedDonations = () => {
    if (completedDonations.length === 0 && pageIsLoading) {
      return (
        <Stack justify="center" align="center" direction="column" grow>
          <Loading dataTest="test" loading text="Please wait, fetching completed donations..." type="pageLoader" />
        </Stack>
      );
    }

    if (completedDonations.length === 0) {
      return (
        <Stack justify="center" align="center" direction="column" grow>
          <BlackText size="medium">No completed donation yet.</BlackText>
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
          <CompletedDonations />
        </Grid>
      </InfiniteScroll>
    );
  };

  const DesktopAndTabletCompletedDonations = () => {
    if (completedDonations.length === 0 && pageIsLoading) {
      return (
        <Stack justify="center" align="center" direction="column" grow>
          <Loading dataTest="test" loading text="Please wait, fetching completed donations..." type="pageLoader" />
        </Stack>
      );
    }

    if (completedDonations.length === 0) {
      return (
        <Stack justify="center" align="center" direction="column" grow>
          <BlackText size="medium">No completed donation yet.</BlackText>
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
          <CompletedDonations />
        </Grid>

        {shouldSeeMore ? <SeeMoreButton /> : null}
      </>
    );
  };

  const CompletedDonations = () => {
    return completedDonations.map((completedDonation) => {
      const completedDonationData = completedDonation.data();
      deserializeFirestoreTimestampToUnixTimestamp(completedDonationData);
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
      } = completedDonationData;
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
          {isLargeMobile ? <DesktopAndTabletCompletedDonations /> : <MobileCompletedDonations />}
        </DonationsContainer>
      </GridSectionContainer>
    </div>
  );
};

export default CompletedDonationsPanel;
