import styled from 'styled-components';
import AccountCircle from '@kiwicom/orbit-components/lib/icons/AccountCircle';
import { colors } from '../../../utils/constants/colors';

const CircularImage = styled.img`
  width: ${(props) => (props.width ? props.width : '40px')};
  height: ${(props) => (props.height ? props.height : '40px')};
  border-radius: 50%;
  object-fit: cover;
`;

const Avatar = ({ height, width, imageUrl }) => {
  return (
    <>
      {imageUrl ? (
        <CircularImage height={height} width={width} src={imageUrl} />
      ) : (
        // show orbit avatar icon if profile image url not provided
        <AccountCircle className="default-avatar" customColor={colors.subtleGrey} size="large" />
      )}
    </>
  );
};

export default Avatar;
