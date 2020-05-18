import styled from 'styled-components';
import BlackText from '../text/BlackText';
import Avatar from '../imageContainers/Avatar';
import { Stack } from '@kiwicom/orbit-components/lib';

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

const AvatarDetails = ({ ...props }) => {
  const { name, distance } = props;
  return (
    <AvatarDetailsContainer>
      <Stack direction="column" spacing="extraTight">
        <BlackText size="small">{name}</BlackText>
        <BlackText size="small">{distance} away</BlackText>
      </Stack>
    </AvatarDetailsContainer>
  );
};

const CardHeader = ({ ...props }) => {
  const { imageUrl, name, distance, timeAgo } = props;
  return (
    <CardHeaderContainer>
      <AvatarContainer>
        <Avatar imageUrl={imageUrl} />
      </AvatarContainer>
      <AvatarDetails name={name} distance={distance || '2.5km'} />
      <TimePostedContainer>
        <TimePosted timeAgo={timeAgo} />
      </TimePostedContainer>
    </CardHeaderContainer>
  );
};

export default CardHeader;
