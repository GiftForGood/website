import styled from 'styled-components';
import { colors } from '@constants/colors';

const TimeslotButton = styled.button`
  background: ${colors.calendarUnselectedBackground};

  box-shadow: 1px 1px 2px 2px ${colors.calendarUnselectedHoverActiveFocus};

  :hover {
    background: ${colors.calendarUnselectedHoverActiveFocus};
  }

  :focus {
    box-shadow: 1px 1px 2px 2px ${colors.calendarUnselectedHoverActiveFocus};
  }

  :focus:not(:focus-visible) {
    background: ${colors.calendarUnselectedHoverActiveFocus};
    box-shadow: 1px 1px 2px 2px ${colors.calendarUnselectedHoverActiveFocus};
  }
`;

export default TimeslotButton;
