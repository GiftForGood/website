import React, { useEffect, useState } from 'react';
import api from '../../../../utils/api';
import BumpableWishCard from '../../card/BumpableWishCard';
import { Grid, Button, Loading, Stack } from '@kiwicom/orbit-components/lib';
import styled, { css } from 'styled-components';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';

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
`;

const PastWishesPanel = ({ isMine, userId }) => {
  const [pastWishes, setPastWishes] = useState([]);

  const fetchPastWishes = () => {
    api.wishes.getNPOWishes(userId).then((wishesDoc) => {
      let wishes = wishesDoc.docs.map((wishDoc) => wishDoc.data());
      setPastWishes(wishes);
    });
  };

  useEffect(() => {
    fetchPastWishes();
  }, []);

  const GridWishes = () => {
    if (pastWishes.length === 0) {
      return (
        <Stack justify="center" align="center" direction="column" grow>
          <Loading dataTest="test" loading text="Please wait, fetching wishes..." type="pageLoader" />
        </Stack>
      );
    }

    return (
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
        {pastWishes.map((pastWish) => (
          <BumpableWishCard
            key={pastWish.wishId}
            wishId={pastWish.wishId}
            name={pastWish.organization.name}
            title={pastWish.title}
            description={pastWish.description}
            profileImageUrl={pastWish.user.profileImageUrl}
            postedDateTime={pastWish.postedDateTime}
            postHref={`/wishes/${pastWish.wishId}`}
            isBumped={pastWish.isBumped}
            expireDateTime={pastWish.expireDateTime}
            bumpCallback={fetchPastWishes}
          />
        ))}
      </Grid>
    );
  };

  return (
    <div>
      <GridSectionContainer>
        <WishesContainer>
          <GridWishes />
        </WishesContainer>
      </GridSectionContainer>
    </div>
  );
};

export default PastWishesPanel;
