import styled from 'styled-components';
import { colors } from '@constants/colors';

const TimeslotButton = styled.button`
  background: ${colors.calendarUnselectedButton.background};

  box-shadow: 1px 1px 2px 2px ${colors.calendarUnselectedButton.hoverActive};

  :hover {
    background: ${colors.calendarUnselectedButton.hoverActive};
  }

  :focus {
    box-shadow: 1px 1px 2px 2px ${colors.calendarUnselectedButton.hoverActive};
  }

  :focus:not(:focus-visible) {
    background: ${colors.calendarUnselectedButton.hoverActive};
    box-shadow: 1px 1px 2px 2px ${colors.calendarUnselectedButton.hoverActive};
  }
`;

export default TimeslotButton;
