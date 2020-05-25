import styled from 'styled-components';
import AccountCircle from '@kiwicom/orbit-components/lib/icons/AccountCircle';
import { colors } from '../../../utils/constants/colors';

const CircularImage = styled.img`
  width: ${(props) => (props.type === 'large' ? '80px' : '40px')};
  height: ${(props) => (props.type === 'large' ? '80px' : '40px')};
  border-radius: 50%;
  object-fit: cover;
`;

const Avatar = ({ type, imageUrl }) => {
  return (
    <>
      {imageUrl ? (
        <CircularImage type={type} src={imageUrl} />
      ) : (
        // show orbit avatar icon if profile image url not provided
        <AccountCircle className="default-avatar" customColor={colors.subtleGrey} size="large" />
      )}
    </>
  );
};

export default Avatar;
