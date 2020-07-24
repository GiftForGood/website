import React, { useState, useEffect, useRef } from 'react';
import { Stack, Loading } from '@kiwicom/orbit-components/lib';
import api from '../../../../utils/api';
import styled from 'styled-components';
import { CardSection } from '@kiwicom/orbit-components/lib/Card';
import useMediaQuery from '@kiwicom/orbit-components/lib/hooks/useMediaQuery';
import NewChatTips from './NewChatTipsForWish';
import InfiniteScroll from '../../scroller/InfiniteScroller';
import { wishes } from '../../../../utils/constants/postType';
import { CHAT_MESSAGES_BATCH_SIZE } from '../../../../utils/api/constants';
import { LeftMessageSection, RightMessageSection } from './ChatMessageSection';
import useStayScrolled from 'react-stay-scrolled';
import useWindowDimensions from '../../../../utils/hooks/useWindowDimensions';

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
  chatDialogUserRow: 108 + 1,
  chatDialogSeePostRow: 96 + 1,
  chatDialogMessagesPadding: 32 + 2,
};

const MessageContainer = styled.div`
  width: 100%;
  min-height: ${({ offsetHeight, viewportHeight }) => viewportHeight - offsetHeight}px;
  max-height: ${({ offsetHeight, viewportHeight }) => viewportHeight - offsetHeight}px;
  position: relative;
  overflow-y: scroll;
  overflow-x: hidden;
  display: flex;
  flex-direction: column-reverse;
`;

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
  const scrollerRef = useRef(null);
  const { stayScrolled, scrollBottom } = useStayScrolled(scrollerRef);
  const { height: viewportHeight } = useWindowDimensions();

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

  const scrollToBottomIfSentByLoggedInUser = (chatMessage) => {
    if (chatMessage.sender.id === loggedInUser.user.userId) {
      scrollBottom();
    }
  };

  const updateChatMessages = (chatMessageDoc) => {
    let isNewlySentMessage = false;
    setChatMessageDocs((prevChatMessageDocs) => {
      const newChatMessage = chatMessageDoc.data();
      const lastChatMessageDoc = prevChatMessageDocs[prevChatMessageDocs.length - 1];
      // insert chat message doc to the back if it is a newly sent message
      if (lastChatMessageDoc && lastChatMessageDoc.data().dateTime <= newChatMessage.dateTime) {
        isNewlySentMessage = true;
        return [...prevChatMessageDocs, chatMessageDoc];
      }
      return [chatMessageDoc, ...prevChatMessageDocs];
    });
    if (isNewlySentMessage) {
      scrollToBottomIfSentByLoggedInUser(chatMessageDoc.data());
    }
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
      stayScrolled(); // so that adding new messages won't shift the scroll position
    });
  };

  // get all heights of components within the chatDialog, only inputRowHeight is passed in as
  // the height is not constant
  const { chatDialogBackButton, chatDialogSeePostRow, chatDialogUserRow, chatDialogMessagesPadding } = isTablet
    ? desktopHeights
    : mobileHeights;

  const sumOfOtherComponentHeights =
    chatDialogBackButton + chatDialogSeePostRow + chatDialogUserRow + chatDialogMessagesPadding + inputRowHeight;

  const offsetHeight = navBarHeight + sumOfOtherComponentHeights;

  // display tips before first message is being sent for a wish
  if (isNewChat && !selectedChatId && postType === wishes) {
    return (
      <CardSection>
        <MessageContainer offsetHeight={offsetHeight} ref={scrollerRef} viewportHeight={viewportHeight}>
          <NewChatTips postType={postType} />
        </MessageContainer>
      </CardSection>
    );
  }

  return (
    <CardSection>
      <MessageContainer offsetHeight={offsetHeight} ref={scrollerRef} viewportHeight={viewportHeight}>
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
                    offsetHeight={offsetHeight}
                  />
                ) : (
                  <LeftMessageSection
                    key={index}
                    message={message}
                    loggedInUser={loggedInUser}
                    selectedChatId={selectedChatId}
                    offsetHeight={offsetHeight}
                  />
                );
              })}
          </Stack>
        </InfiniteScroll>
      </MessageContainer>
    </CardSection>
  );
};

export default ChatDialogMessages;
