import styled from 'styled-components';

const WhiteText = styled.div`
  color: white;
  font-weight: ${(props) => {
    return props.weight === 'bold' ? 'bold' : 'normal';
  }};
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
    if (props.size === 'extraLarge') {
      return '22px';
    }
  }};
`;

export default WhiteText;
