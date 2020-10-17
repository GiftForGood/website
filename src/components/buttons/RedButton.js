import styled from 'styled-components';
import { colors } from '@constants/colors';

const RedButton = styled.button`
  background: ${colors.donorBackground};

  :active {
    background: ${colors.donorHoverActive};
  }

  :hover {
    background: ${colors.donorHoverActive};
  }

  :focus:not(:focus-visible) {
    background: ${colors.donorHoverActive};
    box-shadow: 0 0 0 3px rgba(222, 24, 24, 0.5);
  }

  :focus {
    box-shadow: 0 0 0 3px rgba(222, 24, 24, 0.5);
  }
`;

export default RedButton;
