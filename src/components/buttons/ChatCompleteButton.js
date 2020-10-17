import styled from 'styled-components';
import { colors } from '@constants/colors';

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

  :focus:not(:focus-visible) {
    box-shadow: 0 0 0 3px ${colors.chatCompleteButtonFocus};
    background: ${colors.chatCompleteButtonHoverActive};
  }
`;

export default ChatCompleteButton;
