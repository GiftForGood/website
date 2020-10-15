import styled from 'styled-components';
import { colors } from '@constants/colors';

const BlackButton = styled.button`
  background: ${colors.loginBackground};
  height: 30px;

  :active {
    background: ${colors.loginHoverActive};
  }

  :hover {
    background: ${colors.loginHoverActive};
  }

  :focus:not(:focus-visible) {
    background: ${colors.loginHoverActive};
    box-shadow: 0 0 0 3px rgba(46, 46, 46, 0.5);
  }

  :focus {
    box-shadow: 0 0 0 3px rgba(46, 46, 46, 0.5);
  }
`;

export default BlackButton;
