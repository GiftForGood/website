import styled from 'styled-components';

const GreySubtleButton = styled.button`
  border: 0.5px solid #707070;
  border-radius: 25px;
  font-size: 10px;
  font-weight: normal;
  background: Transparent;
  text-align: center;
  transition: transform 0.2s;

  :hover {
    border: 1.5px solid #707070;
    background: Transparent;
    transform: scale(1.05);
    box-shadow: 0 1px 1px 1px lightgray;
  }
`;

export default GreySubtleButton;
