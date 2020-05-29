import React, { useState, useEffect } from 'react';
import { Stack, Text } from '@kiwicom/orbit-components/lib';
import Grid from '@kiwicom/orbit-components/lib/utils/Grid';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';
import styled, { css } from 'styled-components';

import ProfileHeaderBar from '../modules/ProfileHeaderBar';
import ReviewPanel from '../modules/ReviewPanel';
import ProfilePanel from '../modules/ProfilePanel';

const Wrapper = styled.div`
  margin: 0 auto;
  max-width: 1280px;
  box-sizing: border-box;
  padding-top: 0px;
  padding-bottom: 30px;
`;

const NpoProfilePage = () => {
  const [isShowPastWishes, setIsShowPastWishes] = useState(false);
  const [isShowReviews, setIsShowReviews] = useState(true);

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
          />
          {isShowReviews && <ReviewPanel />}
          {isShowPastWishes && <Text>show past wishes</Text>}
        </Stack>
      </Grid>
    </Wrapper>
  );
};

export default NpoProfilePage;
