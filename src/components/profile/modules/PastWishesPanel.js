import React, { useEffect, useState } from 'react';
import api from '../../../../utils/api';
import BumpableWishCard from '../../card/BumpableWishCard';
import { Grid, Button, Loading, Stack } from '@kiwicom/orbit-components/lib';
import styled, { css } from 'styled-components';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';
import SeeMoreButtonStyle from '../../buttons/SeeMoreButton';
import BlackText from '../../text/BlackText';
import { WISHES_BATCH_SIZE } from '../../../../utils/api/constants';
import InfiniteScroll from '../../scroller/InfiniteScroller';
import useMediaQuery from '@kiwicom/orbit-components/lib/hooks/useMediaQuery';

const GridSectionContainer = styled.div`
  margin-top: 20px;
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
          <BlackText size="medium">No wishes posted yet.</BlackText>
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
          <BlackText size="medium">No wishes posted yet.</BlackText>
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
          <PastWishes />
        </Grid>

        {shouldSeeMore ? <SeeMoreButton /> : null}
      </>
    );
  };

  const PastWishes = () => {
    return pastWishes.map((pastWish, index) => {
      const categoryTags = pastWish.data().categories.map((category) => category.name);
      return (
        <BumpableWishCard
          index={index}
          key={pastWish.data().wishId}
          wishId={pastWish.data().wishId}
          name={pastWish.data().organization.name}
          title={pastWish.data().title}
          description={pastWish.data().description}
          profileImageUrl={pastWish.data().user.profileImageUrl}
          postedDateTime={pastWish.data().postedDateTime}
          postHref={`/wishes/${pastWish.data().wishId}`}
          profileHref={`/profile/${userId}`}
          categoryTags={categoryTags}
          isBumped={pastWish.data().isBumped}
          expireDateTime={pastWish.data().expireDateTime}
          bumpCallback={bumpCallback}
          isMine={isMine}
          status={pastWish.data().status}
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
