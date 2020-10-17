import styled from 'styled-components';
import { colors } from '@constants/colors';

const ScrollToBottomButton = styled.button`
  background: ${colors.chatScrollToBottomButtonBackground};

  :active {
    background: ${colors.chatScrollToBottomButtonHoverActive};
  }

  :hover {
    background: ${colors.chatScrollToBottomButtonHoverActive};
  }

  :focus {
    box-shadow: 0 0 0 3px ${colors.chatScrollToBottomButtonFocus};
  }

  :focus:not(:focus-visible) {
    box-shadow: 0 0 0 3px ${colors.chatScrollToBottomButtonFocus};
    background: ${colors.chatScrollToBottomButtonHoverActive};
  }
`;

export default ScrollToBottomButton;
