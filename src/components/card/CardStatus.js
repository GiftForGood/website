import React from 'react';
import { colors } from '../../../utils/constants/colors';
import styled, { css } from 'styled-components';
import { donations } from '../../../utils/constants/postType';

const CardStatusContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  ${(props) => {
    if (props.cardType === donations) {
      return css`
        width: 100%;
        position: absolute;
        bottom: 0;
      `;
    }
  }}
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
    case 'completed':
      return colors.completedTagBackground;
    case 'closed':
      return colors.closedTagBackground;
    default:
      return 'black';
  }
};
const CardStatus = ({ status, cardType }) => {
  return (
    <CardStatusContainer cardType={cardType}>
      <CardStatusWrapper status={status}>{status.toUpperCase()}</CardStatusWrapper>
    </CardStatusContainer>
  );
};

export default CardStatus;
