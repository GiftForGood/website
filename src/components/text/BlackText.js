import styled from 'styled-components';

const BlackText = styled.div`
  color: black;
  font-weight: ${(props) => {
    return props.weight === 'bold' ? 'bold' : 'normal';
  }};
  text-align: ${(props) => {
    if (props.align === 'center' || props.align === 'left' || props.align === 'right') {
      return props.align;
    }
    return 'left';
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
  }};
`;

export default BlackText;
