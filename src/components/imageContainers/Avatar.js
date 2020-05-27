import styled from 'styled-components';
import AccountCircle from '@kiwicom/orbit-components/lib/icons/AccountCircle';
import { colors } from '../../../utils/constants/colors';

const CircularImage = styled.img`
  width: ${(props) => (props.size ? props.size : '40px')};
  height: ${(props) => (props.size ? props.size : '40px')};
  border-radius: 50%;
  object-fit: cover;
`;

const Avatar = ({ size, imageUrl }) => {
  return (
    <>
      {imageUrl ? (
        <CircularImage size={size} src={imageUrl} />
      ) : (
        // show orbit avatar icon if profile image url not provided
        <AccountCircle className="default-avatar" customColor={colors.subtleGrey} size="large" />
      )}
    </>
  );
};

export default Avatar;
