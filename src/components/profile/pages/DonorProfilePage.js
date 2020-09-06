import React, { useState, useEffect } from 'react';
import { Stack } from '@kiwicom/orbit-components/lib';
import Grid from '@kiwicom/orbit-components/lib/utils/Grid';
import styled from 'styled-components';
import api from '@api';
import { donor as donorProfileType } from '@constants/userType';
import useUser from '../../session/modules/useUser';

import ProfileHeaderBar from '../modules/ProfileHeaderBar';
import ProfilePanel from '../modules/ProfilePanel';
import PastDonationsPanel from '../modules/PastDonationsPanel';
import CompletedWishesPanel from '../modules/CompletedWishesPanel';
import Header from '../../header';

const Wrapper = styled.div`
  margin: 0 auto;
  max-width: 1280px;
  box-sizing: border-box;
  padding-top: 0px;
  padding-bottom: 30px;
`;

const DonorProfilePage = ({ userId }) => {
  const [isShowPastDonations, setIsShowPastDonations] = useState(true);
  const [isShowCompletedWishes, setIsShowCompletedWishes] = useState(false);
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
  }, [user]);

  return (
    <Wrapper>
      <Header title={donor ? donor.name : 'Profile'} />
      <Grid desktop={{ columns: '1fr 5fr' }}>
        <ProfilePanel user={donor} />
        <Stack>
          <ProfileHeaderBar
            profileType={donorProfileType}
            isShowPastPosts={isShowPastDonations}
            setIsShowPastPosts={setIsShowPastDonations}
            isShowCompletedPosts={isShowCompletedWishes}
            setIsShowCompletedPosts={setIsShowCompletedWishes}
            isMine={isMine}
          />
          {isShowCompletedWishes && <CompletedWishesPanel isMine={isMine} userId={userId} />}
          {isShowPastDonations && <PastDonationsPanel isMine={isMine} userId={userId} />}
        </Stack>
      </Grid>
    </Wrapper>
  );
};

export default DonorProfilePage;
