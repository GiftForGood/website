import React from 'react';
import styled from 'styled-components';
import BlackText from '../text/BlackText';
import ProfileAvatar from '../imageContainers/ProfileAvatar';
import { Stack } from '@kiwicom/orbit-components/lib';
import Replace from '@kiwicom/orbit-components/lib/icons/Replace';
import { colors } from '../../../utils/constants/colors';

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
  margin-right: auto;
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

const CardHeader = ({ imageUrl, name, timeAgo, isBumped }) => {
  return (
    <CardHeaderContainer>
      <AvatarContainer>
        <ProfileAvatar imageUrl={imageUrl.small || imageUrl.raw} />
      </AvatarContainer>
      <AvatarDetails name={name} />
      <TimePostedContainer>
        {isBumped ? <Replace customColor={colors.bump} /> : <TimePosted timeAgo={timeAgo} />}
      </TimePostedContainer>
    </CardHeaderContainer>
  );
};

export default CardHeader;
