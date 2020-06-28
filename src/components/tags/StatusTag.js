import React from 'react';
import styled from 'styled-components';
import { colors } from '../../../utils/constants/colors';
import WhiteText from '../../components/text/WhiteText';
import { COMPLETED, CLOSED } from '../../../utils/constants/postStatus';

const TagContainer = styled.div`
  background-color: ${(props) => props.color};
  width: fit-content;
  padding: 2px 5px;
  display: inline-block;
  margin-left: 10px;
`;

const StatusTag = ({ postStatus }) => {
  let tagColor;
  if (postStatus === COMPLETED) {
    tagColor = colors.completedTagBackground;
  } else if (postStatus === CLOSED) {
    tagColor = colors.closedTagBackground;
  } else {
    tagColor = colors.pendingTagBackground;
  }

  return (
    <TagContainer color={tagColor}>
      <WhiteText size="small">{postStatus.toUpperCase()}</WhiteText>
    </TagContainer>
  );
};

export default StatusTag;
