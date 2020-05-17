import styled from 'styled-components';
import { colors } from '../../../utils/constants/colors';

const GreyText = styled.div`
  color: ${colors.subtleGrey};
  font-size: ${(props) => {
    if (props.size === 'extraTiny') {
      return '8px';
    }
    if (props.size === 'tiny') {
      return '10px';
    }
    if (props.size === 'small') {
      return '12px';
    }
    if (props.size === 'medium') {
      return '14px';
    }
    if (props.size === 'large') {
      return '18px';
    }
  }};
`;

export default GreyText;
