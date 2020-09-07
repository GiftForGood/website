import React from 'react';
import styled from 'styled-components';
import BlackText from '../text/BlackText';
import ProfileAvatar from '../imageContainers/ProfileAvatar';
import { Stack } from '@kiwicom/orbit-components/lib';
import Replace from '@kiwicom/orbit-components/lib/icons/Replace';
import { colors } from '@constants/colors';

const CardHeaderContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

const TimePostedContainer = styled.div`
  float: right;
`;

const AvatarContainer = styled.div`
  float: left;
  display: flex;
`;

const AvatarDetailsContainer = styled.div`
  width: fit-content;
  float: left;
  margin-left: 5px;
`;

const ProfileDetailsContainer = styled.div`
  float: left;
  display: flex;
  align-items: center;
  position: relative;
  margin-right: auto;
`;

const ClickableProfile = styled.a`
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 2; /* must be more than 1, since clickable div in wish card has z-index of 1 */
`;

const TimePosted = ({ timeAgo }) => {
  return <BlackText size="small">{timeAgo}</BlackText>;
};

const AvatarDetails = ({ name }) => {
  return (
    <AvatarDetailsContainer>
      <Stack direction="column" spacing="extraTight">
        <BlackText size="small">{name}</BlackText>
      </Stack>
    </AvatarDetailsContainer>
  );
};

const CardHeader = ({ imageUrl, name, timeAgo, isBumped, profileHref }) => {
  return (
    <CardHeaderContainer>
      <ProfileDetailsContainer>
        <AvatarContainer>
          <ProfileAvatar imageUrl={imageUrl.small || imageUrl.raw} />
        </AvatarContainer>
        <AvatarDetails name={name} />
        <ClickableProfile href={profileHref} />
      </ProfileDetailsContainer>
      <TimePostedContainer>
        {isBumped ? <Replace customColor={colors.bump} /> : <TimePosted timeAgo={timeAgo} />}
      </TimePostedContainer>
    </CardHeaderContainer>
  );
};

export default CardHeader;
