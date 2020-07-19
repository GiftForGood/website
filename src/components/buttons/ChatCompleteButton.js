import styled from 'styled-components';
import { colors } from '../../../utils/constants/colors';

const ChatCompleteButton = styled.button`
  background: ${colors.chatCompleteButtonBackground};

  :active {
    background: ${colors.chatCompleteButtonHoverActive};
  }

  :hover {
    background: ${colors.chatCompleteButtonHoverActive};
  }

  :focus {
    box-shadow: 0 0 0 3px ${colors.chatCompleteButtonFocus};
  }
`;

export default ChatCompleteButton;
