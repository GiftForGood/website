import styled from 'styled-components';
import { colors } from '../../../utils/constants/colors';

const ChatSuggestDatesButton = styled.button`
  border-radius: 20px;
  border: 2px solid ${colors.chatSuggestDateButtonHoverActive};
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
