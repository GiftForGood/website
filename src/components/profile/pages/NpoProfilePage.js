import React, { useState, useEffect } from 'react';
import { Stack, Text } from '@kiwicom/orbit-components/lib';
import Grid from '@kiwicom/orbit-components/lib/utils/Grid';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';
import styled, { css } from 'styled-components';

import ProfileHeaderBar from '../modules/ProfileHeaderBar';
import ReviewPanel from '../modules/ReviewPanel';
import ProfilePanel from '../modules/ProfilePanel';
import PastWishesPanel from '../modules/PastWishesPanel';

const Wrapper = styled.div`
  margin: 0 auto;
  max-width: 1280px;
  box-sizing: border-box;
  padding-top: 0px;
  padding-bottom: 30px;
`;

const NpoProfilePage = ({ userId }) => {
  const [isShowPastWishes, setIsShowPastWishes] = useState(true);
  const [isShowReviews, setIsShowReviews] = useState(false);
  const [npo, setNpo] = useState(null);
  const [isMine, setIsMine] = useState(false);

  useEffect(() => {
    // TODO: Check if the userId exists.
    // TODO: Check if the profile belongs to me.
    setNpo(null);
    setIsMine(true);
  }, []);

  return (
    <Wrapper>
      <Grid desktop={{ columns: '1fr 5fr' }}>
        <ProfilePanel />
        <Stack>
          <ProfileHeaderBar
            isShowPastWishes={isShowPastWishes}
            isShowReviews={isShowReviews}
            setIsShowPastWishes={setIsShowPastWishes}
            setIsShowReviews={setIsShowReviews}
            isMine={isMine}
          />
          {isShowReviews && <ReviewPanel />}
          {isShowPastWishes && <PastWishesPanel isMine={isMine} userId={userId} />}
        </Stack>
      </Grid>
    </Wrapper>
  );
};

export default NpoProfilePage;
