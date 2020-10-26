import React, { useState, useEffect } from 'react';
import { Stack } from '@kiwicom/orbit-components/lib';
import Grid from '@kiwicom/orbit-components/lib/utils/Grid';
import styled from 'styled-components';
import api from '@api';
import client from '@utils/axios';
import { npo as npoProfileType } from '@constants/userType';
import useUser from '../../session/modules/useUser';

import ProfileHeaderBar from '../modules/ProfileHeaderBar';
import ProfilePanel from '../modules/ProfilePanel';
import PastWishesPanel from '../modules/PastWishesPanel';
import CompletedDonationsPanel from '../modules/CompletedDonationsPanel';
import Header from '../../header';

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
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isMine, setIsMine] = useState(false);
  const [npo, setNpo] = useState(null);
  const user = useUser();

  const fetchUserInfo = async () => {
    const [userDoc, emailVerifiedResp] = await Promise.all([
      api.users.getNPO(userId),
      client.post('/api/emailVerified', { id: userId }),
    ]);
    if (userDoc.exists) {
      setIsMine(isMyProfile(userDoc));
      setNpo(userDoc.data());
    } else {
      setIsMine(false);
    }
    if (emailVerifiedResp.status === 200) {
      setIsEmailVerified(emailVerifiedResp.data.emailVerified);
    }
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
        <ProfilePanel user={npo} isEmailVerified={isEmailVerified} />
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
