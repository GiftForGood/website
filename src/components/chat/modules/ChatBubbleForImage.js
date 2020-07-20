import React from 'react';
import styled from 'styled-components';
import { colors } from '../../../../utils/constants/colors';

// note that the max height of the image is set to 80% of the chat dialog messages' height,
// to prevent any image message that is longer than the chat dialog height.
const ChatBubbleImage = styled.img`
  max-width: min(400px, 90%);
  width: auto;
  height: auto;
  max-height: calc(0.8 * ${({ messageContainerHeight }) => messageContainerHeight}px);
  object-fit: cover;
  padding: 5px 5px 5px 5px;
  border-radius: 5px;
  background-color: ${(props) =>
    props.isByLoggedInUser ? colors.myChatBubbleBackground : colors.oppositeChatBubbleBackground};
`;

/**
 *
 * @param {string} imageUrl is the imageUrl to display in the chat bubble
 * @param {string} isByLoggedInUser is whether the image is sent by logged in user
 * @param {string} messageContainerHeight is the height of the ChatDialogMessages component
 *
 */
const ChatBubbleForImage = ({ imageUrl, isByLoggedInUser, messageContainerHeight }) => {
  return (
    <ChatBubbleImage
      isByLoggedInUser={isByLoggedInUser}
      src={imageUrl}
      messageContainerHeight={messageContainerHeight}
    />
  );
};

export default ChatBubbleForImage;
