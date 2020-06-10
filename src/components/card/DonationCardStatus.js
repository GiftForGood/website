import React from 'react';
import { colors } from '../../../utils/constants/colors';
import styled from 'styled-components';
import { COMPLETED, CLOSED } from '../../../utils/constants/postStatus';

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
    case COMPLETED:
      return colors.completedTagBackground;
    case CLOSED:
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
