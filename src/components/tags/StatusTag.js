import React from 'react';
import styled from 'styled-components';
import { colors } from '@constants/colors';
import WhiteText from '../../components/text/WhiteText';
import { COMPLETED, CLOSED } from '@constants/postStatus';
import { DELIVERED } from '@constants/chatStatus';

const TagContainer = styled.div`
  background-color: ${(props) => props.color};
  width: fit-content;
  padding: 6px 12px;
  border-radius: 3px;
`;

const StatusTag = ({ status }) => {
  let tagColor;
  if (status === COMPLETED) {
    tagColor = colors.completedTagBackground;
  } else if (status === CLOSED) {
    tagColor = colors.closedTagBackground;
  } else if (status === DELIVERED) {
    tagColor = colors.deliveredTagBackground;
  } else {
    tagColor = colors.pendingTagBackground;
  }

  return (
    <TagContainer color={tagColor}>
      <WhiteText size="small" weight="bold">
        {status.toUpperCase()}
      </WhiteText>
    </TagContainer>
  );
};

export default StatusTag;
