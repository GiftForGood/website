import styled from 'styled-components';

const BlackText = styled.div`
  color: black;
  font-size: ${(props) => {
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
