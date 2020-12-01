import styled from 'styled-components';
import { colors } from '@constants/colors';

const TimeslotButton = styled.button`
  background: ${colors.calendarUnselectedButton.background};

  box-shadow: 1px 1px 2px 2px ${colors.calendarUnselectedButton.hover};

  :hover {
    background: ${colors.calendarUnselectedButton.hover};
  }

  :focus {
    box-shadow: 1px 1px 2px 2px ${colors.calendarUnselectedButton.hover};
  }

  :focus:not(:focus-visible) {
    background: ${colors.calendarUnselectedButton.hover};
    box-shadow: 1px 1px 2px 2px ${colors.calendarUnselectedButton.hover};
  }
`;

export default TimeslotButton;
