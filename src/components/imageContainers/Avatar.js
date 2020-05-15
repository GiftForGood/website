import styled from 'styled-components';
import { defaultAvatarPath } from '../../../utils/constants/imagePaths';

const CircularImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;

const Avatar = ({ imageUrl }) => {
  return <CircularImage src={imageUrl || defaultAvatarPath} />;
};

export default Avatar;
