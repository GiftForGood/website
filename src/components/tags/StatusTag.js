import React from 'react';
import styled from 'styled-components';
import { colors } from '@constants/colors';
import WhiteText from '../../components/text/WhiteText';
import { COMPLETED, CLOSED } from '@constants/postStatus';

const TagContainer = styled.div`
  background-color: ${(props) => props.color};
  width: fit-content;
  padding: 6px 12px;
  border-radius: 3px;
`;

const StatusTag = ({ postStatus }) => {
  let tagColor;
  if (postStatus === COMPLETED) {
    tagColor = colors.primaryTeal.background;
  } else if (postStatus === CLOSED) {
    tagColor = colors.primaryRed.background;
  } else {
    tagColor = colors.pendingTag.background;
  }

  return (
    <TagContainer color={tagColor}>
      <WhiteText size="small" weight="bold">
        {postStatus.toUpperCase()}
      </WhiteText>
    </TagContainer>
  );
};

export default StatusTag;
