import styled from 'styled-components';
import { colors } from '@constants/colors';

const ChatDeliveredButton = styled.button`
  background: ${colors.chatDeliveredButtonBackground};

  :active {
    background: ${colors.chatDeliveredButtonHoverActive};
  }

  :hover {
    background: ${colors.chatDeliveredButtonHoverActive};
  }

  :focus {
    box-shadow: 0 0 0 3px ${colors.chatDeliveredButtonFocus};
  }
`;

export default ChatDeliveredButton;
