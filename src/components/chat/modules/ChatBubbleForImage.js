import React from 'react';
import styled, { css } from 'styled-components';
import { colors } from '../../../../utils/constants/colors';

const ChatBubbleImage = styled.img`
  max-width: min(60%, 400px);
  width: fit-content;
  padding: 5px 5px 5px 5px;
  border-radius: 5px;
  background-color: ${(props) =>
    props.isByLoggedInUser ? colors.myChatBubbleBackground : colors.oppositeChatBubbleBackground};
`;

/**
 *
 * @param {string} imageUrl is the imageUrl to display in the chat bubble
 * @param {string} isByLoggedInUser is whether the image is sent by logged in user
 */
const ChatBubbleForImage = ({ imageUrl, isByLoggedInUser }) => {
  return <ChatBubbleImage isByLoggedInUser={isByLoggedInUser} src={imageUrl} />;
};

export default ChatBubbleForImage;
