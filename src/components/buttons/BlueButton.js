import styled from 'styled-components';
import { colors } from '@constants/colors';

const BlueButton = styled.button`
  background: ${colors.npoBackground};

  :active {
    background: ${colors.npoHoverActive};
  }

  :hover {
    background: ${colors.npoHoverActive};
  }

  :focus:not(:focus-visible) {
    background: ${colors.npoHoverActive};
    box-shadow: 0 0 0 3px rgba(4, 65, 170, 0.5);
  }

  :focus {
    box-shadow: 0 0 0 3px rgba(4, 65, 170, 0.5);
  }
`;

export default BlueButton;
