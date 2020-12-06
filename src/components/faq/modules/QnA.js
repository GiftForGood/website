import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { MaxWidthContainer } from '@components/containers';

const QnAContainer = styled(MaxWidthContainer)`
  position: relative;
  display: flex;
  flex-direction: column;
  margin-top: 0;
  margin-bottom: 0;
  width: auto;
`;

const QuestionContainer = styled.div``;

const AnswerContainer = styled.div``;

const QnA = ({ question, answer }) => {
  return (
    <QnAContainer>
      <QuestionContainer>
        <summary>{question}</summary>
      </QuestionContainer>
      <AnswerContainer>{answer}</AnswerContainer>
    </QnAContainer>
  );
};

export default QnA;
