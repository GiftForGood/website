import styled from 'styled-components';
import { colors } from '../../../utils/constants/colors';

const GreySubtleButton = styled.button`
  border: 0.5px solid ${colors.subtleGrey};
  border-radius: 25px;
  font-weight: normal;
  background: Transparent;
  text-align: center;
  transition: transform 0.2s;

  :hover {
    background: Transparent;
    box-shadow: 0px 0px 5px 0px rgba(37, 42, 49, 0.16), 0px 2px 8px 0px rgba(37, 42, 49, 0.12);
  }
`;

export default GreySubtleButton;
