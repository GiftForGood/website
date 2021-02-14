import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';

// components
import BumpableWishCard from '@components/card/BumpableWishCard';
import { Grid, Button, Loading, Stack } from '@kiwicom/orbit-components/lib';
import SeeMoreButtonStyle from '@components/buttons/SeeMoreButton';
import BlackText from '@components/text/BlackText';
import InfiniteScroll from '@components/scroller/InfiniteScroller';
import EmptyStateImage from '@components/imageContainers/EmptyStateImage';

// constants and utils
import api from '@api';
import { WISHES_BATCH_SIZE } from '@api/constants';
import { deserializeFirestoreTimestampToUnixTimestamp } from '@utils/firebase/deserializer';

// hooks
import useMediaQuery from '@kiwicom/orbit-components/lib/hooks/useMediaQuery';
import { useRemoteConfig } from '@components/remoteConfig/RemoteConfig';

const GridSectionContainer = styled.div`
  margin-top: 25px;
`;

const WishesContainer = styled.div`
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

const PastWishesPanel = ({ isMine, userId }) => {
  const [pastWishes, setPastWishes] = useState([]);
  const [shouldSeeMore, setShouldSeeMore] = useState(true);
  const [seeMoreIsLoading, setSeeMoreIsLoading] = useState(false);
  const [pageIsLoading, setPageIsLoading] = useState(true);
  const { isLargeMobile } = useMediaQuery();
  const remoteConfig = useRemoteConfig();

  const fetchPastWishes = (lastQueriedDocument) => {
    setPageIsLoading(true);
    api.wishes
      .getNPOWishes(userId, lastQueriedDocument)
      .then((wishesDoc) => {
        const numberOfDocumentsReturned = wishesDoc.docs.length;
        if (numberOfDocumentsReturned < WISHES_BATCH_SIZE) {
          // loaded all documents already, since the number of wishes returned is less than batch size
          setShouldSeeMore(false);
        }
        setPastWishes([...pastWishes, ...wishesDoc.docs]);
        setSeeMoreIsLoading(false);
      })
      .finally(() => {
        setPageIsLoading(false);
      });
  };

  useEffect(() => {
    fetchPastWishes(null);
  }, []);

  const getLastQueriedDocument = () => {
    if (pastWishes.length === 0) {
      return null;
    }
    return pastWishes[pastWishes.length - 1];
  };

  const onSeeMoreClicked = () => {
    setSeeMoreIsLoading(true);
    fetchPastWishes(getLastQueriedDocument());
  };

  const bumpCallback = (index, updatedWish) => {
    let updatedPastWishes = [...pastWishes];
    updatedPastWishes[index] = updatedWish;
    setPastWishes(updatedPastWishes);
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

  const MobilePastWishes = () => {
    if (pastWishes.length === 0 && pageIsLoading) {
      return (
        <Stack justify="center" align="center" direction="column" grow>
          <Loading dataTest="test" loading text="Please wait, fetching wishes..." type="pageLoader" />
        </Stack>
      );
    }

    if (pastWishes.length === 0) {
      return (
        <Stack justify="center" align="center" direction="column" grow>
          <EmptyStateImage label="No wishes posted yet." />
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
          rowGap="30px"
          columnGap="20px"
          columns="1fr"
        >
          <PastWishes />
        </Grid>
      </InfiniteScroll>
    );
  };

  const DesktopAndTabletPastWishes = () => {
    if (pastWishes.length === 0 && pageIsLoading) {
      return (
        <Stack justify="center" align="center" direction="column" grow>
          <Loading dataTest="test" loading text="Please wait, fetching wishes..." type="pageLoader" />
        </Stack>
      );
    }

    if (pastWishes.length === 0) {
      return (
        <Stack justify="center" align="center" direction="column" grow>
          <EmptyStateImage label="No wishes posted yet." />
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
          rowGap="30px"
          columnGap="20px"
        >
          <PastWishes />
        </Grid>

        {shouldSeeMore ? <SeeMoreButton /> : null}
      </>
    );
  };

  const PastWishes = () => {
    return pastWishes.map((pastWish, index) => {
      const pastWishData = pastWish.data();
      deserializeFirestoreTimestampToUnixTimestamp(pastWishData);
      const {
        wishId,
        organization,
        title,
        description,
        user,
        postedDateTime,
        isBumped,
        status,
        expireDateTime,
        event,
      } = pastWishData;
      const categoryTags = pastWish.data().categories.map((category) => category.name);
      return (
        <BumpableWishCard
          index={index}
          key={wishId}
          wishId={wishId}
          name={organization.name}
          title={title}
          description={description}
          profileImageUrl={user.profileImageUrl}
          postedDateTime={postedDateTime}
          postHref={`/wishes/${wishId}`}
          profileHref={`/profile/${userId}`}
          categoryTags={categoryTags}
          isBumped={isBumped}
          expireDateTime={expireDateTime}
          bumpCallback={bumpCallback}
          isMine={isMine}
          status={status}
          seasonal={
            remoteConfig?.configs?.currentEvent.key &&
            event?.key &&
            remoteConfig?.configs?.currentEvent.key === event?.key
              ? event
              : null
          }
        />
      );
    });
  };

  return (
    <div>
      <GridSectionContainer>
        <WishesContainer>{isLargeMobile ? <DesktopAndTabletPastWishes /> : <MobilePastWishes />}</WishesContainer>
      </GridSectionContainer>
    </div>
  );
};

export default PastWishesPanel;
