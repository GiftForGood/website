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

const TimePosted = ({ timeAgo }) => {
  return (
    <div style={{ float: 'right' }}>
      <BlackText size="small">{timeAgo}</BlackText>
    </div>
  );
};

const AvatarDetails = ({ ...props }) => {
  const { name, distance } = props;
  return (
    <div style={{ width: 'fit-content', float: 'left', margin: '0 auto', marginLeft: '5px' }}>
      <Stack direction="column" spacing="extraTight">
        <BlackText size="small">{name}</BlackText>
        <BlackText size="small">{distance} away</BlackText>
      </Stack>
    </div>
  );
};

const CardHeader = ({ ...props }) => {
  const { imageUrl, name, distance, timeAgo } = props;
  return (
    <CardHeaderContainer>
      <div style={{ float: 'left' }}>
        <Avatar imageUrl={imageUrl || defaultAvatarPath} />
      </div>
      <AvatarDetails name={name} distance={distance || '2.5km'} />
      <TimePosted timeAgo={timeAgo} />
    </CardHeaderContainer>
  );
};

export default CardHeader;
