import styled from 'styled-components';

export const MaxWidthContainer = styled.div`
  width: 90vw;
  max-width: 1280px;
  margin: 0 auto;
  margin-top: ${(props) => (props.marginTop ? props.marginTop : '50')}px;
  margin-bottom: ${(props) => (props.marginBottom ? props.marginBottom : '40')}px;
`;
