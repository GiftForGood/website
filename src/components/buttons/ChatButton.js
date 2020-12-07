import styled from 'styled-components';
import { colors } from '@constants/colors';

const ChatButton = styled.button`
  background: ${colors.chatButton.background};

  :active {
    background: ${colors.chatButton.hoverActive};
  }

  :hover {
    background: ${colors.chatButton.hoverActive};
  }

  :focus {
    box-shadow: 0 0 0 3px ${colors.chatButton.focus};
  }

  :focus:not(:focus-visible) {
    box-shadow: 0 0 0 3px ${colors.chatButton.focus};
    background: ${colors.chatButton.hoverActive};
  }
`;

export default ChatButton;
