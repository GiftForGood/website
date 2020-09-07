import styled from 'styled-components';
import { colors } from '@constants/colors';

const ChatSuggestDatesButton = styled.button`
  background: ${colors.chatSuggestDateButtonBackground};

  :active {
    background: ${colors.chatSuggestDateButtonHoverActive};
  }

  :hover {
    background: ${colors.chatSuggestDateButtonHoverActive};
  }

  :focus {
    box-shadow: 0 0 0 3px ${colors.chatSuggestDateButtonFocus};
  }
`;

export default ChatSuggestDatesButton;
