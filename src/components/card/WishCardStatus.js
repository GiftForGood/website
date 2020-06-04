import React from 'react';
import { colors } from '../../../utils/constants/colors';
import styled from 'styled-components';
import { completed, closed } from '../../../utils/constants/postStatus';

const CardStatusContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;

const CardStatusWrapper = styled.div`
  display: flex;
  background-color: ${(props) => getColor(props.status)};
  padding-top: 5px;
  padding-bottom: 5px;
  padding-left: 15px;
  padding-right: 15px;
  color: white;
`;

const getColor = (status) => {
  switch (status) {
    case completed:
      return colors.completedTagBackground;
    case closed:
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

export default CardStatus;
