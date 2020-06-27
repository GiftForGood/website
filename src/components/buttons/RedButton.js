import styled from 'styled-components';
import { colors } from '../../../utils/constants/colors';

const RedButton = styled.button`
  background: ${colors.donorBackground} !important;

  :active {
    background: ${colors.donorHoverActive} !important;
  }

  :hover {
    background: ${colors.donorHoverActive} !important;
  }

  :focus {
    box-shadow: 0 0 0 3px rgba(222, 24, 24, 0.5) !important;
  }
`;

export default RedButton;
