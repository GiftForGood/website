import React from 'react';
import styled from 'styled-components';

// components
import BlackText from '@components/text/BlackText';
import WhiteText from '@components/text/WhiteText';
import Linkify from 'react-linkify';

// constants
import { colors } from '@constants/colors';

const ChatBubbleContainer = styled.div`
  width: fit-content;
  padding: 5px 15px 5px 15px;
  border-radius: 5px;
  background-color: ${(props) =>
    props.isByLoggedInUser ? colors.myChatBubble.background : colors.oppositeChatBubble.background};
`;

/**
 *
 * @param {string} text is the text to display in the chat bubble
 * @param {string} isByLoggedInUser is whether the text is sent by logged in user
 */
const ChatBubbleForText = ({ text, isByLoggedInUser }) => {
  return (
    <ChatBubbleContainer isByLoggedInUser={isByLoggedInUser}>
      <pre>
        {isByLoggedInUser ? (
          /* temporary solution to change the color of links, follow this issue thread 
        for updates: https://github.com/tasti/react-linkify/issues/96 */

          <Linkify
            componentDecorator={(decoratedHref, decoratedText, key) => (
              <a target="blank" href={decoratedHref} key={key} style={{ color: 'white' }}>
                {decoratedText}
              </a>
            )}
          >
            <WhiteText size="small">{text}</WhiteText>
          </Linkify>
        ) : (
          <Linkify
            componentDecorator={(decoratedHref, decoratedText, key) => (
              <a target="blank" href={decoratedHref} key={key}>
                {decoratedText}
              </a>
            )}
          >
            <BlackText size="small">{text}</BlackText>
          </Linkify>
        )}
      </pre>
    </ChatBubbleContainer>
  );
};

export default ChatBubbleForText;
