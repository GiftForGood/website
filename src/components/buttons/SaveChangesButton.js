import styled from 'styled-components';
import { colors } from '@constants/colors';

const SaveChangesButton = styled.button`
  background: ${colors.saveChangesBackground};

  :active {
    background: ${colors.saveChangesHoverActive};
  }

  :hover {
    background: ${colors.saveChangesHoverActive};
  }

  :focus {
    box-shadow: 0 0 0 3px ${colors.chatCompleteButtonFocus};
  }

  :focus:not(:focus-visible) {
    box-shadow: 0 0 0 3px ${colors.chatCompleteButtonFocus};
    background: ${colors.saveChangesHoverActive};
  }
`;

export default SaveChangesButton;
