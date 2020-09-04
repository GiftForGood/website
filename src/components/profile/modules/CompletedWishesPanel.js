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

const CompletedWishesPanel = ({ isMine, userId }) => {
  const [completedWishes, setCompletedWishes] = useState([]);
  const [shouldSeeMore, setShouldSeeMore] = useState(true);
  const [pageIsLoading, setpageIsLoading] = useState(true);
  const [seeMoreIsLoading, setSeeMoreIsLoading] = useState(false);
  const { isLargeMobile } = useMediaQuery();

  const fetchCompletedWishes = (lastQueriedDocument) => {
    setpageIsLoading(true);
    api.wishes
      .getDonorCompletedWishes(userId, lastQueriedDocument)
      .then((wishesDoc) => {
        const numberOfDocumentsReturned = wishesDoc.docs.length;
        if (numberOfDocumentsReturned < WISHES_BATCH_SIZE) {
          // loaded all documents already, since the number of wishes returned is less than batch size
          setShouldSeeMore(false);
        }
        setCompletedWishes([...completedWishes, ...wishesDoc.docs]);
        setSeeMoreIsLoading(false);
      })
      .finally(() => {
        setpageIsLoading(false);
      });
  };

  useEffect(() => {
    fetchCompletedWishes(null);
  }, []);

  const getLastQueriedDocument = () => {
    if (completedWishes.length === 0) {
      return null;
    }
    return completedWishes[completedWishes.length - 1];
  };

  const onSeeMoreClicked = () => {
    setSeeMoreIsLoading(true);
    fetchCompletedWishes(getLastQueriedDocument());
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
    if (completedWishes.length === 0 && pageIsLoading) {
      return (
        <Stack justify="center" align="center" direction="column" grow>
          <Loading dataTest="test" loading text="Please wait, fetching completed wishes..." type="pageLoader" />
        </Stack>
      );
    }

    if (completedWishes.length === 0) {
      return (
        <Stack justify="center" align="center" direction="column" grow>
          <BlackText size="medium">No completed wish yet.</BlackText>
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
          <CompletedWishes />
        </Grid>
      </InfiniteScroll>
    );
  };

  const DesktopAndTabletCompletedWishes = () => {
    if (completedWishes.length === 0 && pageIsLoading) {
      return (
        <Stack justify="center" align="center" direction="column" grow>
          <Loading dataTest="test" loading text="Please wait, fetching completed wishes..." type="pageLoader" />
        </Stack>
      );
    }

    if (completedWishes.length === 0) {
      return (
        <Stack justify="center" align="center" direction="column" grow>
          <BlackText size="medium">No completed wish yet.</BlackText>
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
          <CompletedWishes />
        </Grid>

        {shouldSeeMore ? <SeeMoreButton /> : null}
      </>
    );
  };

  const CompletedWishes = () => {
    return completedWishes.map((completedWish, index) => {
      console.log(completedWish.data());
      const categoryTags = completedWish.data().categories.map((category) => category.name);
      return (
        <BumpableWishCard
          index={index}
          key={completedWish.data().wishId}
          wishId={completedWish.data().wishId}
          name={completedWish.data().organization.name}
          title={completedWish.data().title}
          description={completedWish.data().description}
          profileImageUrl={completedWish.data().user.profileImageUrl}
          postedDateTime={completedWish.data().postedDateTime}
          postHref={`/wishes/${completedWish.data().wishId}`}
          profileHref={`/profile/${completedWish.data().user.userId}`}
          categoryTags={categoryTags}
          isBumped={completedWish.data().isBumped}
          isMine={false}
          status={completedWish.data().status}
        />
      );
    });
  };

  return (
    <div>
      <GridSectionContainer>
        <WishesContainer>{isLargeMobile ? <DesktopAndTabletCompletedWishes /> : <MobilePastWishes />}</WishesContainer>
      </GridSectionContainer>
    </div>
  );
};

export default CompletedWishesPanel;
