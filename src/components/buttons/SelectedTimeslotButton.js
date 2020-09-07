import styled from 'styled-components';
import { colors } from '@constants/colors';

const SelectedTimeslotButton = styled.button`
  background: ${colors.calendarSelectedBackground};

  :hover {
    background: ${colors.calendarSelectedHoverActive};
  }

  :focus {
    box-shadow: 0 0 0 3px ${colors.calendarSelectedFocus};
  }
`;

export default SelectedTimeslotButton;
