import React, { useState } from 'react';
import styled from 'styled-components';

const TopicContainer = styled.div`
  border-radius: 10px;
  box-shadow: 0px 0px 10px 0px rgba(37, 42, 49, 0.16), 0px 2px 8px 0px rgba(37, 42, 49, 0.12);
  width: 100%;
`;

const TitleContainer = styled.div`
  cursor: pointer;
  margin: 20px;
`;

const ContentContainer = styled.div`
  margin: 20px;
`;

const Topic = ({ title, contents }) => {
  const [isToggled, setIsToggled] = useState(false);
  return (
    <TopicContainer>
      <TitleContainer onClick={() => setIsToggled((isToggled) => !isToggled)}>
        <h3>{title}</h3>
      </TitleContainer>
      {isToggled && <ContentContainer>{contents}</ContentContainer>}
    </TopicContainer>
  );
};

export default Topic;
