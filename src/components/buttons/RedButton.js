import styled from 'styled-components';
import { colors } from '@constants/colors';

const RedButton = styled.button`
  background: ${colors.primaryRed.background};

  :active {
    background: ${colors.primaryRed.hoverActive};
  }

  :hover {
    background: ${colors.primaryRed.hoverActive};
  }

  :focus:not(:focus-visible) {
    background: ${colors.primaryRed.hoverActive};
    box-shadow: 0 0 0 3px rgba(222, 24, 24, 0.5);
  }

  :focus {
    box-shadow: 0 0 0 3px rgba(222, 24, 24, 0.5);
  }
`;

export default RedButton;
