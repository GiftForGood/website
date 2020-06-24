import React, { useState, useEffect } from 'react';
import { Stack } from '@kiwicom/orbit-components/lib';
import api from '../../../../utils/api';
import styled, { css } from 'styled-components';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';
import { CardSection } from '@kiwicom/orbit-components/lib/Card';
import ChatBubbleForText from './ChatBubbleForText';
import ChatBubbleForImage from './ChatBubbleForImage';
import ProfileAvatar from '../../imageContainers/ProfileAvatar';
import { getTimeDifferenceFromNow } from '../../../../utils/api/time';
import GreyText from '../../text/GreyText';
import useMediaQuery from '@kiwicom/orbit-components/lib/hooks/useMediaQuery';
import ChatBubbleForCalendar from './ChatBubbleForCalendar';

/**
 * To be changed if any of the heights change, the extra "+1 or +2" for the top/bottom borders
 */
const desktopHeights = {
  chatDialogBackButton: 0, // 0 as it does not exist in desktop
  chatDialogUserRow: 88 + 1,
  chatDialogSeePostRow: 113 + 1,
  chatDialogInputRow: 74,
  chatDialogMessagesPadding: 48 + 2,
};

const mobileHeights = {
  chatDialogBackButton: 44,
  chatDialogUserRow: 104 + 1,
  chatDialogSeePostRow: 96 + 1,
  chatDialogInputRow: 74,
  chatDialogMessagesPadding: 32 + 2,
};

const MessageContainer = styled.div`
  width: 100%;
  min-height: calc(100vh - ${(props) => props.offsetHeight}px);
  max-height: calc(100vh - ${(props) => props.offsetHeight}px);
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
  max-width: 90%;
  ${media.tablet(css`
    max-width: 60%;
  `)}
`;

const LeftMessageSectionContainer = styled.div`
  width: fit-content;
  max-width: 90%;
  ${media.tablet(css`
    max-width: 60%;
  `)}
`;

/**
 * Gets the corresponding chat bubble based on message content type
 */
const getMessageContent = (messageContentType, content, isByLoggedInUser, sender, loggedInUser, selectedChatId) => {
  if (messageContentType === 'text') {
    return <ChatBubbleForText text={content} isByLoggedInUser={isByLoggedInUser} />;
  }
  if (messageContentType === 'image') {
    return <ChatBubbleForImage imageUrl={content} isByLoggedInUser={isByLoggedInUser} />;
  }
  if (messageContentType === 'calendar') {
    const dateTimes = content.split(','); // dateTimes are separated by comma delimiter
    return (
      <ChatBubbleForCalendar
        dateTimes={dateTimes}
        isByLoggedInUser={isByLoggedInUser}
        sender={sender}
        loggedInUser={loggedInUser}
        selectedChatId={selectedChatId}
      />
    );
  }
  // unknown message content type
  return <div>N.A.</div>;
};

const LeftMessageSection = ({ message, loggedInUser, selectedChatId }) => {
  const { content, sender, dateTime, contentType } = message;
  return (
    <LeftMessageSectionContainer>
      <Stack direction="row" grow={false}>
        <ProfileAvatar imageUrl={sender.profileImageUrl} width={25} height={25} />
        <Stack direction="column" spacing="extraTight">
          {getMessageContent(contentType, content, false, sender, loggedInUser, selectedChatId)}
          <GreyText size="tiny">{getTimeDifferenceFromNow(dateTime)}</GreyText>
        </Stack>
      </Stack>
    </LeftMessageSectionContainer>
  );
};

const RightMessageSection = ({ message, loggedInUser, selectedChatId }) => {
  const { content, sender, dateTime, contentType } = message;
  return (
    <Stack direction="column" align="end" spaceAfter="none" grow={false}>
      <RightMessageSectionContainer>
        <Stack direction="row">
          <RightColumnStackContainer>
            <Stack direction="column" spacing="extraTight" align="end">
              {getMessageContent(contentType, content, true, sender, loggedInUser, selectedChatId)}
              <GreyText size="tiny">{getTimeDifferenceFromNow(dateTime)}</GreyText>
            </Stack>
          </RightColumnStackContainer>
          <ProfileAvatar imageUrl={sender.profileImageUrl} width={25} height={25} />
        </Stack>
      </RightMessageSectionContainer>
    </Stack>
  );
};

/**
 *
 * @param {number} navBarHeight is the height of the navbar
 */
const ChatDialogMessages = ({ loggedInUser, selectedChatId, isNewChat, navBarHeight }) => {
  const [chatMessages, setChatMessages] = useState([]);
  const { isTablet } = useMediaQuery();
  useEffect(() => {
    // when selected a chat, subscribe to the corresponding chat messages
    if (selectedChatId != null || !isNewChat) {
      api.chats.subscribeToChatMessages(selectedChatId, updateChatMessages).then(() => {});
    }
  }, [selectedChatId]);

  const updateChatMessages = (chatMessageDoc) => {
    setChatMessages((prevChatMessages) => {
      const newChatMessage = chatMessageDoc.data();
      const lastChatMessage = prevChatMessages[prevChatMessages.length - 1];

      // insert chat message to correct position
      if (lastChatMessage && lastChatMessage.dateTime < newChatMessage.dateTime) {
        return [...prevChatMessages, newChatMessage];
      }
      return [newChatMessage, ...prevChatMessages];
    });
  };

  // get all heights of components within the chatDialog
  const {
    chatDialogBackButton,
    chatDialogInputRow,
    chatDialogSeePostRow,
    chatDialogUserRow,
    chatDialogMessagesPadding,
  } = isTablet ? desktopHeights : mobileHeights;

  const sumOfOtherComponentHeights =
    chatDialogBackButton + chatDialogInputRow + chatDialogSeePostRow + chatDialogUserRow + chatDialogMessagesPadding;

  // offsetHeight is used to calculate the amount of height left for the ChatDialogMessages to occupy
  const offsetHeight = navBarHeight + sumOfOtherComponentHeights;

  return (
    <CardSection>
      <MessageContainer offsetHeight={offsetHeight}>
        <Stack direction="column">
          {chatMessages &&
            chatMessages.map((message, index) => {
              // right side is logged in user's messages, left side is opposite user's
              return message.sender.id === loggedInUser.user.userId ? (
                <RightMessageSection
                  key={index}
                  message={message}
                  loggedInUser={loggedInUser}
                  selectedChatId={selectedChatId}
                />
              ) : (
                <LeftMessageSection
                  key={index}
                  message={message}
                  loggedInUser={loggedInUser}
                  selectedChatId={selectedChatId}
                />
              );
            })}
        </Stack>
      </MessageContainer>
    </CardSection>
  );
};

export default ChatDialogMessages;
