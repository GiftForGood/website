import styled from 'styled-components';
import { colors } from '../../../utils/constants/colors';

const SeeMoreButton = styled.button`
  border: 0.5px solid ${colors.subtleGrey};
  border-radius: 3px;
  font-weight: normal;
  background: Transparent;
  text-align: center;
  margin: 0 auto;
  width: 110px;
  height: 40px;
  transition: transform 0.2s;

  :hover {
    background: ${colors.seeMoreHoverFocusActive};
    box-shadow: 0px 0px 5px 0px rgba(37, 42, 49, 0.16), 0px 2px 8px 0px rgba(37, 42, 49, 0.12);
  }

  :active {
    background: ${colors.seeMoreHoverFocusActive};
    box-shadow: 0px 0px 5px 0px rgba(37, 42, 49, 0.16), 0px 2px 8px 0px rgba(37, 42, 49, 0.12);
  }

  :focus {
    background: ${colors.seeMoreHoverFocusActive};
    box-shadow: 0px 0px 5px 0px rgba(37, 42, 49, 0.16), 0px 2px 8px 0px rgba(37, 42, 49, 0.12);
  }
`;

export default SeeMoreButton;
