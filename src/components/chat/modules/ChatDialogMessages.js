import React, { useState, useEffect, useRef } from 'react';
import { Stack, Loading } from '@kiwicom/orbit-components/lib';
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
import NewChatTips from './NewChatTipsForWish';
import InfiniteScroll from 'react-infinite-scroller';
import { wishes } from '../../../../utils/constants/postType';
import { CHAT_MESSAGES_BATCH_SIZE } from '../../../../utils/api/constants';

/**
 * To be changed if any of the heights change, the extra "+1 or +2" for the top/bottom borders
 */
const desktopHeights = {
  chatDialogBackButton: 0, // 0 as it does not exist in desktop
  chatDialogUserRow: 88 + 1,
  chatDialogSeePostRow: 113 + 1,
  chatDialogMessagesPadding: 48 + 2,
};

const mobileHeights = {
  chatDialogBackButton: 44,
  chatDialogUserRow: 104 + 1,
  chatDialogSeePostRow: 96 + 1,
  chatDialogMessagesPadding: 32 + 2,
};

const MessageContainer = styled.div`
  width: 100%;
  min-height: calc(100vh - ${({ offsetHeight }) => offsetHeight}px);
  max-height: calc(100vh - ${({ offsetHeight }) => offsetHeight}px);
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

const LeftColumnStackContainer = styled.div`
  width: fit-content;
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
        <ProfileAvatar imageUrl={sender.profileImageUrl.small || sender.profileImageUrl.raw} width={25} height={25} />
        <LeftColumnStackContainer>
          <Stack direction="column" spacing="extraTight">
            {getMessageContent(contentType, content, false, sender, loggedInUser, selectedChatId)}
            <GreyText size="tiny">{getTimeDifferenceFromNow(dateTime)}</GreyText>
          </Stack>
        </LeftColumnStackContainer>
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
          <ProfileAvatar imageUrl={sender.profileImageUrl.small || sender.profileImageUrl.raw} width={25} height={25} />
        </Stack>
      </RightMessageSectionContainer>
    </Stack>
  );
};

/**
 *
 * @param {number} navBarHeight is the height of the navbar
 */
const ChatDialogMessages = ({ postType, loggedInUser, selectedChatId, isNewChat, navBarHeight, inputRowHeight }) => {
  const [chatMessageDocs, setChatMessageDocs] = useState([]);
  // only consider loading more when it's not a new chat, since it's impossible to have a new chat
  // to have messages initially
  const [shouldSeeMore, setShouldSeeMore] = useState(!isNewChat);
  const { isTablet } = useMediaQuery();

  useEffect(() => {
    // reset values every time selectedChatId changes
    setChatMessageDocs([]);
    setShouldSeeMore(!isNewChat);

    let unsubscribeFunction;
    // when selected a chat, subscribe to the corresponding chat messages
    if (selectedChatId !== null || !isNewChat) {
      api.chats.subscribeToChatMessages(selectedChatId, updateChatMessages).then((fn) => (unsubscribeFunction = fn));
      disableFurtherLoadsIfMessagesLessThanOneBatch();
    }

    return () => {
      if (unsubscribeFunction) {
        api.chats.unsubscribeFromChatMessages(selectedChatId, unsubscribeFunction).then(() => {
          setChatMessageDocs([]);
        });
      }
    };
  }, [selectedChatId]);

  const messagesEndRef = useRef(null); // to keep track of the bottom of the messages

  const scrollToBottomIfSentByLoggedInUser = (chatMessage) => {
    if (messagesEndRef && messagesEndRef.current && chatMessage.sender.id === loggedInUser.user.userId) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const updateChatMessages = (chatMessageDoc) => {
    setChatMessageDocs((prevChatMessageDocs) => {
      const newChatMessage = chatMessageDoc.data();
      const lastChatMessageDoc = prevChatMessageDocs[prevChatMessageDocs.length - 1];
      // insert chat message doc to correct position
      if (lastChatMessageDoc && lastChatMessageDoc.data().dateTime <= newChatMessage.dateTime) {
        return [...prevChatMessageDocs, chatMessageDoc];
      }
      return [chatMessageDoc, ...prevChatMessageDocs];
    });
    scrollToBottomIfSentByLoggedInUser(chatMessageDoc.data());
  };

  /**
   * A hacky way to determine if we should load more after the first batch,
   * since the subscription method does not tell whether the first load of chat
   * messages are less than one CHAT_MESSAGES_BATCH_SIZE
   */
  const disableFurtherLoadsIfMessagesLessThanOneBatch = () => {
    api.chats.getChatMessages(selectedChatId).then((rawNewChatMessages) => {
      if (rawNewChatMessages.docs.length < CHAT_MESSAGES_BATCH_SIZE) {
        // loaded all chat messages
        setShouldSeeMore(false);
      }
    });
  };

  const handleOnSeeMore = () => {
    api.chats.getChatMessages(selectedChatId, chatMessageDocs[0]).then((rawNewChatMessages) => {
      // need to reverse the new chat message docs since the order of the array is latest -> oldest, but in our
      // array the order is oldest -> latest
      const newChatMessageDocs = rawNewChatMessages.docs.reverse();
      setChatMessageDocs([...newChatMessageDocs, ...chatMessageDocs]);
      if (newChatMessageDocs.length < CHAT_MESSAGES_BATCH_SIZE) {
        // loaded all chat messages
        setShouldSeeMore(false);
      }
    });
  };

  // get all heights of components within the chatDialog, only inputRowHeight is passed in as
  // the height is not constant
  const { chatDialogBackButton, chatDialogSeePostRow, chatDialogUserRow, chatDialogMessagesPadding } = isTablet
    ? desktopHeights
    : mobileHeights;

  const sumOfOtherComponentHeights =
    chatDialogBackButton + chatDialogSeePostRow + chatDialogUserRow + chatDialogMessagesPadding + inputRowHeight;

  // offsetHeight is used to calculate the amount of height left for the ChatDialogMessages to occupy
  const offsetHeight = navBarHeight + sumOfOtherComponentHeights;

  // display tips before first message is being sent for a wish
  if (isNewChat && !selectedChatId && postType === wishes) {
    return (
      <CardSection>
        <MessageContainer offsetHeight={offsetHeight}>
          <NewChatTips postType={postType} />
        </MessageContainer>
      </CardSection>
    );
  }

  return (
    <CardSection>
      <MessageContainer offsetHeight={offsetHeight}>
        <InfiniteScroll
          loadMore={handleOnSeeMore}
          hasMore={shouldSeeMore}
          isReverse
          initialLoad={false}
          useWindow={false}
          loader={<Loading type="pageLoader" key={0} />}
        >
          <Stack direction="column">
            {chatMessageDocs &&
              chatMessageDocs.map((messageDoc, index) => {
                const message = messageDoc.data();
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
            <div ref={messagesEndRef} />
          </Stack>
        </InfiniteScroll>
      </MessageContainer>
    </CardSection>
  );
};

export default ChatDialogMessages;
