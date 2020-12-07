import styled from 'styled-components';
import { colors } from '@constants/colors';

const BlackButton = styled.button`
  background: ${colors.loginButton.background};
  height: 30px;

  :active {
    background: ${colors.loginButton.hoverActive};
  }

  :hover {
    background: ${colors.loginButton.hoverActive};
  }

  :focus:not(:focus-visible) {
    background: ${colors.loginButton.hoverActive};
    box-shadow: 0 0 0 3px rgba(46, 46, 46, 0.5);
  }

  :focus {
    box-shadow: 0 0 0 3px rgba(46, 46, 46, 0.5);
  }
`;

export default BlackButton;
