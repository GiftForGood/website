import styled from 'styled-components';
import { colors } from '@constants/colors';

const ScrollToBottomButton = styled.button`
  background: ${colors.chatScrollToBottomButton.background};

  :active {
    background: ${colors.chatScrollToBottomButton.hoverActive};
  }

  :hover {
    background: ${colors.chatScrollToBottomButton.hoverActive};
  }

  :focus {
    box-shadow: 0 0 0 3px ${colors.chatScrollToBottomButton.focus};
  }

  :focus:not(:focus-visible) {
    box-shadow: 0 0 0 3px ${colors.chatScrollToBottomButton.focus};
    background: ${colors.chatScrollToBottomButton.hoverActive};
  }
`;

export default ScrollToBottomButton;
