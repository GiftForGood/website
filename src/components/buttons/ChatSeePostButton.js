import styled from 'styled-components';
import { colors } from '@constants/colors';

const ChatSeePostButton = styled.button`
  background: ${colors.chatSeePostButton.background};

  :active {
    background: ${colors.chatSeePostButton.hoverActive};
  }

  :hover {
    background: ${colors.chatSeePostButton.hoverActive};
  }

  :focus {
    box-shadow: 0 0 0 3px ${colors.chatSeePostButton.focus};
  }

  :focus:not(:focus-visible) {
    box-shadow: 0 0 0 3px ${colors.chatSeePostButton.focus};
    background: ${colors.chatSeePostButton.hoverActive};
  }
`;

export default ChatSeePostButton;
