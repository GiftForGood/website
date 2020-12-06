import React from 'react';
import styled from 'styled-components';
import { Heading } from '@kiwicom/orbit-components/lib';
import { MaxWidthContainer } from '@components/containers';

const TopicContainer = styled(MaxWidthContainer)`
  border-radius: 10px;
  box-shadow: 0px 0px 10px 0px rgba(37, 42, 49, 0.16), 0px 2px 8px 0px rgba(37, 42, 49, 0.12);
  display: flex;
  flex-direction: column;
  margin-top: 0;
  margin-bottom: 0;
  padding: 30px;
  position: relative;
  width: 100%;
`;

const Topic = ({ title, contents }) => {
  return (
    <TopicContainer>
      <Heading type="title2" spaceAfter="large">
        {title}
      </Heading>
      {contents}
    </TopicContainer>
  );
};

export default Topic;
