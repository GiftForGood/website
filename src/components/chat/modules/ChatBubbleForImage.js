import React from 'react';
import styled from 'styled-components';
import { colors } from '@constants/colors';

// note that the max height of the image is set to 80% of the chat dialog messages' height,
// to prevent any image message that is longer than the chat dialog height.
const ChatBubbleImage = styled.img`
  max-width: min(400px, 90%);
  width: auto;
  height: auto;
  max-height: calc(0.8 * calc(100vh - ${({ offsetHeight }) => offsetHeight}px));
  object-fit: cover;
  padding: 5px 5px 5px 5px;
  border-radius: 5px;
  background-color: ${(props) =>
    props.isByLoggedInUser ? colors.myChatBubble.background : colors.oppositeChatBubble.background};
`;

/**
 *
 * @param {string} imageUrl is the imageUrl to display in the chat bubble
 * @param {string} isByLoggedInUser is whether the image is sent by logged in user
 * @param {string} offsetHeight is the height occupied by other components in ChatDialog,
 *                              except the ChatDialogMessages component
 *
 */
const ChatBubbleForImage = ({ imageUrl, isByLoggedInUser, offsetHeight }) => {
  return <ChatBubbleImage isByLoggedInUser={isByLoggedInUser} src={imageUrl} offsetHeight={offsetHeight} />;
};

export default ChatBubbleForImage;
