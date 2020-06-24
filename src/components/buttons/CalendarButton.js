import styled from 'styled-components';
import { Button } from '@kiwicom/orbit-components/lib';
import { colors } from '../../../utils/constants/colors';
import GreyText from '../text/GreyText';

const CalendarButtonStyle = styled.button`
  border: 0.5px solid ${colors.subtleGrey};
  font-weight: normal;
  background: Transparent;
  text-align: center;
  min-width: 250px;
  transition: transform 0.2s;

  :active {
    background: ${colors.npoHoverActive};
  }

  :hover {
    background: Transparent;
    box-shadow: 0px 0px 5px 0px rgba(37, 42, 49, 0.16), 0px 2px 8px 0px rgba(37, 42, 49, 0.12);
  }

  :focus {
    box-shadow: 0 0 0 3px rgba(37, 42, 49, 0.16), 0px 2px 8px 0px rgba(37, 42, 49, 0.12);
  }
`;

const CalendarButton = ({ dateTime, onClickHandler, isByLoggedInUser }) => {
  return (
    <Button asComponent={CalendarButtonStyle} size="small" onClick={onClickHandler} disabled={isByLoggedInUser}>
      <GreyText>{dateTime}</GreyText>
    </Button>
  );
};

export default CalendarButton;
