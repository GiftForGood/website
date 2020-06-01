import React from 'react';
import { colors } from '../../../utils/constants/colors';
import styled, { css } from 'styled-components';

const CardStatusContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;

const CardStatusWrapper = styled.div`
  display: flex;
  background-color: ${(props) => getColor(props.status)};
  padding: 5px;
  color: white;
`;

const getColor = (status) => {
  switch (status) {
    case 'completed':
      return colors.completedTagBackground;
    case 'closed':
      return colors.closedTagBackground;
    default:
      return 'black';
  }
};
const CardStatus = ({ status }) => {
  return (
    <CardStatusContainer>
      <CardStatusWrapper status={status}>{status.toUpperCase()}</CardStatusWrapper>
    </CardStatusContainer>
  );
};

export default CardStatus