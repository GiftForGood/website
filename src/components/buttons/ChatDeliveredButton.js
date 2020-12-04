import styled from 'styled-components';
import { colors } from '@constants/colors';

const ChatDeliveredButton = styled.button`
  background: ${colors.primaryTeal.background};

  :active {
    background: ${colors.primaryTeal.hoverActive};
  }

  :hover {
    background: ${colors.primaryTeal.hoverActive};
  }

  :focus {
    box-shadow: 0 0 0 3px ${colors.primaryTeal.focus};
  }

  :focus:not(:focus-visible) {
    background: ${colors.primaryTeal.background};
    box-shadow: 0 0 0 3px ${colors.primaryTeal.focus};
  }
`;

export default ChatDeliveredButton;
