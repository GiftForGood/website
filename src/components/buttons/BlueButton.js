import styled from 'styled-components';
import { colors } from '@constants/colors';

const BlueButton = styled.button`
  background: ${colors.primaryBlue.background};

  :active {
    background: ${colors.primaryBlue.hoverActive};
  }

  :hover {
    background: ${colors.primaryBlue.hoverActive};
  }

  :focus:not(:focus-visible) {
    background: ${colors.primaryBlue.hoverActive};
    box-shadow: 0 0 0 3px rgba(4, 65, 170, 0.5);
  }

  :focus {
    box-shadow: 0 0 0 3px rgba(4, 65, 170, 0.5);
  }
`;

export default BlueButton;
