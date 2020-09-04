import styled from 'styled-components';
import { colors } from '../../../utils/constants/colors';

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
`;

export default ScrollToBottomButton;
