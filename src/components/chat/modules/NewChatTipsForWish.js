import React from 'react';
import BlackText from '../../text/BlackText';
import styled from 'styled-components';

const MessageContainer = styled.div`
  max-width: min(500px, 90%);
  position: absolute;
  top: 50%;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
`;

const MessageTitle = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

const MessageQuestion = styled.div`
  margin-bottom: 5px;
`;

const MessageAnswer = styled.div`
  margin-bottom: 15px;
`;

const NewChatTipsForWish = () => {
  return (
    <MessageContainer>
      <MessageTitle>
        <BlackText size="large" weight="bold">
          Check it before you send it
        </BlackText>
      </MessageTitle>
      <MessageQuestion>
        <BlackText size="medium">Do I need to measure my furniture dimensions?</BlackText>
      </MessageQuestion>
      <MessageAnswer>
        <BlackText size="medium">
          Measuring your furniture is very important as it might not fit into some of our beneficiary homes/houses!
          Always measure the height, width and length.
        </BlackText>
      </MessageAnswer>
      <MessageQuestion>
        <BlackText size="medium">Is my item usable?</BlackText>
      </MessageQuestion>
      <MessageAnswer>
        <BlackText size="medium">
          It is very important to only donate usable items! Nobody wants to use a broken bed or chair.
        </BlackText>
      </MessageAnswer>
      <MessageQuestion>
        <BlackText size="medium">Are there bed bugs?</BlackText>
      </MessageQuestion>
      <MessageAnswer>
        <BlackText size="medium">Nobody wants your bed bug! Discard or disinfect the furniture first!</BlackText>
      </MessageAnswer>
    </MessageContainer>
  );
};

export default NewChatTipsForWish;
