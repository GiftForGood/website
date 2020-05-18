import styled from 'styled-components';
import BlackText from '../text/BlackText';
import Avatar from '../imageContainers/Avatar';
import { Stack } from '@kiwicom/orbit-components/lib';
import { defaultAvatarPath } from '../../../utils/constants/imagePaths';

const CardHeaderContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

const RightAnchor = styled.div`
  float: right;
`;

const LeftAnchor = styled.div`
  float: left;
`;

const AvatarDetailsContainer = styled.div`
  width: fit-content;
  float: left;
  margin: 0 auto;
  margin-left: 5px;
`;

const TimePosted = ({ timeAgo }) => {
  return (
    <RightAnchor>
      <BlackText size="small">{timeAgo}</BlackText>
    </RightAnchor>
  );
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
      <LeftAnchor>
        <Avatar imageUrl={imageUrl} />
      </LeftAnchor>
      <AvatarDetails name={name} distance={distance || '2.5km'} />
      <TimePosted timeAgo={timeAgo} />
    </CardHeaderContainer>
  );
};

export default CardHeader;
