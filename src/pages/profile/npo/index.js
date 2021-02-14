import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// components
import { Stack, Grid } from '@kiwicom/orbit-components/lib';
import { ProfileHeaderBar, ProfilePanel } from '../components';
import { CompletedDonationsPanel, PastWishesPanel } from './components';
import Header from '@components/header';

// constants and utils
import api from '@api';
import { npo as npoProfileType } from '@constants/userType';

// hooks
import useUser from '@components/session/modules/useUser';

const Wrapper = styled.div`
  margin: 0 auto;
  max-width: 1280px;
  box-sizing: border-box;
  padding-top: 0px;
  padding-bottom: 30px;
`;

const NpoProfilePage = ({ userId }) => {
  const [isShowPastWishes, setIsShowPastWishes] = useState(true);
  const [isShowCompletedDonations, setIsShowCompletedDonations] = useState(false);
  const [isMine, setIsMine] = useState(false);
  const [npo, setNpo] = useState(null);
  const user = useUser();

  const fetchUserInfo = () => {
    api.users.getNPO(userId).then((userDoc) => {
      if (userDoc.exists) {
        setIsMine(isMyProfile(userDoc));
        setNpo(userDoc.data());
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
      <Header title={npo ? npo.name : 'Profile'} />
      <Grid desktop={{ columns: '1fr 5fr' }}>
        <ProfilePanel user={npo} />
        <Stack>
          <ProfileHeaderBar
            profileType={npoProfileType}
            isShowPastPosts={isShowPastWishes}
            setIsShowPastPosts={setIsShowPastWishes}
            isShowCompletedPosts={isShowCompletedDonations}
            setIsShowCompletedPosts={setIsShowCompletedDonations}
            isMine={isMine}
          />
          {isShowCompletedDonations && <CompletedDonationsPanel isMine={isMine} userId={userId} />}
          {isShowPastWishes && <PastWishesPanel isMine={isMine} userId={userId} />}
        </Stack>
      </Grid>
    </Wrapper>
  );
};

export default NpoProfilePage;
