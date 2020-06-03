import styled from 'styled-components';
import { colors } from '../../../utils/constants/colors';

const EditProfileButton = styled.button`
  background: ${colors.chatButtonBackground};
  :active {
    background: ${colors.chatButtonHoverActive};
  }
  :hover {
    background: ${colors.chatButtonHoverActive};
  }
  :focus {
    box-shadow: 0 0 0 3px ${colors.chatButtonFocus};
  }
`;

export default EditProfileButton;
