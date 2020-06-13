import React, { useState, useEffect } from 'react';
import { Stack } from '@kiwicom/orbit-components/lib';
import api from '../../../../utils/api';
import styled, { css } from 'styled-components';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';
import { CardSection } from '@kiwicom/orbit-components/lib/Card';
import ChatBubbleForText from './ChatBubbleForText';
import ProfileAvatar from '../../imageContainers/ProfileAvatar';
import { getTimeDifferenceFromNow } from '../../../../utils/api/time';
import GreyText from '../../text/GreyText';

const MessageContainer = styled.div`
  width: 100%;
  min-height: 45vh;
  max-height: 45vh;
  ${media.tablet(css`
    min-height: 55vh;
    max-height: 55vh;
  `)}
  position: relative;
  overflow-y: scroll;
  overflow-x: hidden;
  display: flex;
  flex-direction: column-reverse;
`;

// to following two containers are used to prevent the
// right section to exceed the maximum width
const RightColumnStackContainer = styled.div`
  width: fit-content;
`;

const RightMessageSectionContainer = styled.div`
  width: fit-content;
`;

const LeftMessageSection = ({ message }) => {
  return (
    <Stack direction="row">
      <ProfileAvatar imageUrl={message.profileImageUrl} width={25} height={25} />
      <Stack direction="column" spacing="extraTight">
        {message.messageContentType === 'text' ? (
          <ChatBubbleForText text={message.message} isByLoggedInUser={false} />
        ) : (
          <div>image container (to be done)</div>
        )}
        <GreyText size="tiny">{getTimeDifferenceFromNow(message.messageDate)}</GreyText>
      </Stack>
    </Stack>
  );
};

const RightMessageSection = ({ message }) => {
  return (
    <Stack direction="column" align="end">
      <RightMessageSectionContainer>
        <Stack direction="row">
          <RightColumnStackContainer>
            <Stack direction="column" spacing="extraTight" align="end">
              {message.messageContentType === 'text' ? (
                <ChatBubbleForText text={message.message} isByLoggedInUser={true} />
              ) : (
                <div>image container (to be done)</div>
              )}
              <GreyText size="tiny">{getTimeDifferenceFromNow(message.messageDate)}</GreyText>
            </Stack>
          </RightColumnStackContainer>
          <ProfileAvatar imageUrl={message.profileImageUrl} width={25} height={25} />
        </Stack>
      </RightMessageSectionContainer>
    </Stack>
  );
};

/**
 *
 * @param {array} messages is an array of chat messages
 */
const ChatDialogMessages = ({ messages }) => {
  return (
    <CardSection>
      <MessageContainer>
        <Stack direction="column">
          {messages.map((message, index) => {
            return message.isByLoggedInUser ? (
              <RightMessageSection key={index} message={message} />
            ) : (
              <LeftMessageSection key={index} message={message} />
            );
          })}
        </Stack>
      </MessageContainer>
    </CardSection>
  );
};

export default ChatDialogMessages;
