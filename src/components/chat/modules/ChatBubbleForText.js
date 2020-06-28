import React from 'react';
import BlackText from '../../text/BlackText';
import WhiteText from '../../text/WhiteText';
import styled from 'styled-components';
import { colors } from '../../../../utils/constants/colors';

const ChatBubbleContainer = styled.div`
  width: fit-content;
  padding: 5px 15px 5px 15px;
  border-radius: 5px;
  word-break: break-word;
  background-color: ${(props) =>
    props.isByLoggedInUser ? colors.myChatBubbleBackground : colors.oppositeChatBubbleBackground};
`;

/**
 *
 * @param {string} text is the text to display in the chat bubble
 * @param {string} isByLoggedInUser is whether the text is sent by logged in user
 */
const ChatBubbleForText = ({ text, isByLoggedInUser }) => {
  return (
    <ChatBubbleContainer isByLoggedInUser={isByLoggedInUser}>
      {isByLoggedInUser ? <WhiteText size="small">{text}</WhiteText> : <BlackText size="small">{text}</BlackText>}
    </ChatBubbleContainer>
  );
};

export default ChatBubbleForText;
