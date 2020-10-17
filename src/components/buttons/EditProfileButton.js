import styled from 'styled-components';
import { colors } from '@constants/colors';

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

  :focus:not(:focus-visible) {
    box-shadow: 0 0 0 3px ${colors.chatButtonFocus};
    background: ${colors.chatButtonHoverActive};
  }
`;

export default EditProfileButton;
