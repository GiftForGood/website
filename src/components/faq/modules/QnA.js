import React, { useState } from 'react';
import styled from 'styled-components';
import ChevronRight from '@kiwicom/orbit-components/lib/icons/ChevronRight';

const QnAContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
`;

const AnimatedChevron = styled(ChevronRight)`
  transition-duration: 0.2s;
  transform: ${({ isToggled }) => (isToggled ? 'rotate(90deg)' : 'rotate(0deg)')};
`;

const QuestionContainer = styled.div`
  cursor: pointer;
`;

const AnswerContainer = styled.div`
  margin-left: 20px;
`;

const QnA = ({ question, answer }) => {
  const [isToggledAnswer, setIsToggledAnswer] = useState(false);
  return (
    <QnAContainer>
      <QuestionContainer onClick={() => setIsToggledAnswer((isToggledAnswer) => !isToggledAnswer)}>
        <summary>
          <AnimatedChevron isToggled={isToggledAnswer} />
          {question}
        </summary>
      </QuestionContainer>
      {isToggledAnswer && <AnswerContainer>{answer}</AnswerContainer>}
    </QnAContainer>
  );
};

export default QnA;
