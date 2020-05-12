import styled from 'styled-components';

const GreySubtleButton = styled.button`
  border: 0.5px solid #707070;
  border-radius: 25px;
  font-size: 10px;
  background: Transparent;
  text-align: center;
  margin: 0.5vh auto;

  :active {
    border-color: 1px solid #707070;
    background: Transparent;
    color: #707070;
  }

  :hover {
    border-color: 1px solid #707070;
    background: Transparent;
    color: #707070;
  }

  :focus {
    box-shadow: 0 0 0 3px #707070;
  }
`;

export default GreySubtleButton;
