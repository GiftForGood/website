import React from 'react';
import { colors } from '../../../utils/constants/colors';
import styled from 'styled-components';
import { completed, closed } from '../../../utils/constants/postStatus';

const CardStatusContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  background-color: ${(props) => getColor(props.status)};
  width: 100%;
  position: absolute;
  bottom: 0;
`;

const CardStatusWrapper = styled.div`
  display: flex;
  padding-left: 15px;
  padding-top: 5px;
  padding-bottom: 5px;
  color: white;
  flex: auto;
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
    <CardStatusContainer status={status}>
      <CardStatusWrapper>{status.toUpperCase()}</CardStatusWrapper>
    </CardStatusContainer>
  );
};

export default CardStatus;
