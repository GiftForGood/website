import styled from 'styled-components';
import { colors } from '../../../utils/constants/colors';

const BlueButton = styled.button`
  background: ${colors.npoBackground};

  :active {
    background: ${colors.npoHoverActive};
  }

  :hover {
    background: ${colors.npoHoverActive};
  }

  :focus {
    box-shadow: 0 0 0 3px rgba(4, 65, 170, 0.5);
  }
`;

export default BlueButton;
