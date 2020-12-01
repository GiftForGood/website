import styled from 'styled-components';
import { colors } from '@constants/colors';

const ChatSuggestDatesButton = styled.button`
  background: ${colors.chatSuggestDateButton.background};

  :active {
    background: ${colors.chatSuggestDateButton.hoverActive};
  }

  :hover {
    background: ${colors.chatSuggestDateButton.hoverActive};
  }

  :focus {
    box-shadow: 0 0 0 3px ${colors.chatSuggestDateButton.focus};
  }

  :focus:not(:focus-visible) {
    box-shadow: 0 0 0 3px ${colors.chatSuggestDateButton.focus};
    background: ${colors.chatSuggestDateButton.hoverActive};
  }
`;

export default ChatSuggestDatesButton;
