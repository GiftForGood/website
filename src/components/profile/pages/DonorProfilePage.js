import React, { useState, useEffect } from 'react';
import { Stack, Text } from '@kiwicom/orbit-components/lib';
import Grid from '@kiwicom/orbit-components/lib/utils/Grid';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';
import styled, { css } from 'styled-components';
import api from '../../../../utils/api';
import { donor as donorProfileType } from '../../../../utils/constants/userType';
import useUser from '../../session/modules/useUser';

import ProfileHeaderBar from '../modules/ProfileHeaderBar';
import ReviewPanel from '../modules/ReviewPanel';
import ProfilePanel from '../modules/ProfilePanel';
import PastDonationsPanel from '../modules/PastDonationsPanel';

const Wrapper = styled.div`
  margin: 0 auto;
  max-width: 1280px;
  box-sizing: border-box;
  padding-top: 0px;
  padding-bottom: 30px;
`;

const DonorProfilePage = ({ userId }) => {
  const [isShowPastDonations, setIsShowPastDonations] = useState(true);
  const [isShowReviews, setIsShowReviews] = useState(false);
  const [isMine, setIsMine] = useState(false);
  const [donor, setDonor] = useState(null);
  const user = useUser();

  const fetchUserInfo = () => {
    api.users.getDonor(userId).then((userDoc) => {
      if (userDoc.exists) {
        setIsMine(isMyProfile(userDoc));
        setDonor(userDoc.data());
      } else {
        setIsMine(false);
      }
    });
  };

  const isMyProfile = (userDoc) => {
    if (user) {
      return userDoc.data().userId === user.userId;
    }
    return false;
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  return (
    <Wrapper>
      <Grid desktop={{ columns: '1fr 5fr' }}>
        <ProfilePanel user={donor} />
        <Stack>
          <ProfileHeaderBar
            profileType={donorProfileType}
            isShowPastPosts={isShowPastDonations}
            isShowReviews={isShowReviews}
            setIsShowPastPosts={setIsShowPastDonations}
            setIsShowReviews={setIsShowReviews}
            isMine={isMine}
          />
          {isShowReviews && <ReviewPanel />}
          {isShowPastDonations && <PastDonationsPanel isMine={isMine} userId={userId} />}
        </Stack>
      </Grid>
    </Wrapper>
  );
};

export default DonorProfilePage;
