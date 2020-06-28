import styled from 'styled-components';
import { colors } from '../../../utils/constants/colors';

const ForgetPasswordButton = styled.button`
  background: ${colors.loginBackground};

  :active {
    background: ${colors.loginHoverActive};
  }

  :hover {
    background: ${colors.loginHoverActive};
  }

  :focus {
    box-shadow: 0 0 0 3px rgba(46, 46, 46, 0.5);
  }
`;

export default ForgetPasswordButton;