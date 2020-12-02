import styled from 'styled-components';
import { colors } from '@constants/colors';

const SelectedTimeslotButton = styled.button`
  background: ${colors.primaryTeal.background};

  :hover {
    background: ${colors.primaryTeal.hoverActive};
  }

  :focus {
    box-shadow: 0 0 0 3px ${colors.primaryTeal.focus};
  }

  :focus:not(:focus-visible) {
    background: ${colors.primaryTeal.hoverActive};
    box-shadow: 0 0 0 3px ${colors.primaryTeal.focus};
  }
`;

export default SelectedTimeslotButton;
