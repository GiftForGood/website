import React, { useState, useEffect, useRef, useContext } from 'react';
import { Stack, Loading, Button, NotificationBadge } from '@kiwicom/orbit-components/lib';
import { ChevronDown } from '@kiwicom/orbit-components/lib/icons';
import api from '../../../../utils/api';
import styled from 'styled-components';
import { CardSection } from '@kiwicom/orbit-components/lib/Card';
import useMediaQuery from '@kiwicom/orbit-components/lib/hooks/useMediaQuery';
import NewChatTips from './NewChatTipsForWish';
import InfiniteScroll from '../../scroller/InfiniteScroller';
import { wishes } from '../../../../utils/constants/postType';
import { CHAT_MESSAGES_BATCH_SIZE } from '../../../../utils/api/constants';
import { LeftMessageSection, RightMessageSection } from './ChatMessageSection';
import ScrollToBottomButton from '../../buttons/ScrollToBottomButton';
import useWindowDimensions from '../../../../utils/hooks/useWindowDimensions';
import ChatDialogFloatingButtons from './ChatDialogFloatingButtons';
import { isSafari } from 'react-device-detect';
import ChatContext from '../context';
import { getSelectedChatId, getIsNewChat, getUser } from '../selectors';
import useNavbarHeight from '../../navbar/modules/useNavbarHeight';

/**
 * To be changed if any of the heights change, the extra "+1 or +2" for the top/bottom borders
 */
const desktopHeights = {
  chatDialogBackButton: 0, // 0 as it does not exist in desktop
  chatDialogUserRow: 88 + 1,
  chatDialogSeePostRow: 90 + 1,
  chatDialogMessagesPadding: 48 + 2,
};

const mobileHeights = {
  chatDialogBackButton: 44,
  chatDialogUserRow: 72 + 1,
  chatDialogSeePostRow: 74 + 1,
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

const ScrollToBottomContainer = styled.div`
  position: relative;
`;

const ScrollerButtonContainer = styled.div`
  position: absolute;
  transition: all 1s ease-in-out;
  float: left;
  bottom: 10px;
  left: 50%;
  transform: translate(-50%, 0);
  cursor: pointer;
`;

const NotificationBadgeWrapper = styled.div`
  position: absolute;
  bottom: 40px;
  left: 50%;
`;

/**
 *
 * @param {number} navBarHeight is the height of the navbar
 */
const ChatDialogMessages = ({ postType, postId, inputRowHeight, isShowPostDetails }) => {
  const { state } = useContext(ChatContext);
  const loggedInUser = getUser(state);
  const isNewChat = getIsNewChat(state);
  const selectedChatId = getSelectedChatId(state);
  const navBarHeight = useNavbarHeight();

  const [chatMessageDocs, setChatMessageDocs] = useState([]);
  // only consider loading more when it's not a new chat, since it's impossible to have a new chat
  // to have messages initially
  const [shouldSeeMore, setShouldSeeMore] = useState(!isNewChat);
  const [isLoadingMore, setIsLoadingMore] = useState(false); // to prevent multiple loads at the same time
  const [isShowScrollerButton, setIsShowScrollerButton] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { isTablet } = useMediaQuery();
  const bottomOfScrollerRef = useRef(null);
  const scrollerRef = useRef(null);
  const { height: viewportHeight } = useWindowDimensions();

  useEffect(() => {
    // reset values every time selectedChatId changes
    setChatMessageDocs([]);
    setShouldSeeMore(!isNewChat);
    setIsShowScrollerButton(false);

    let unsubscribeFunction;
    const { userId } = loggedInUser.user;
    // when selected a chat, subscribe to the corresponding chat messages
    if (selectedChatId !== null || !isNewChat) {
      api.chats
        .subscribeToChatMessages(selectedChatId, userId, updateChatMessages)
        .then((fn) => (unsubscribeFunction = fn));
      disableFurtherLoadsIfMessagesLessThanOneBatch();
    }

    return () => {
      if (unsubscribeFunction) {
        api.chats.unsubscribeFromChatMessages(selectedChatId, userId, unsubscribeFunction).then(() => {
          setChatMessageDocs([]);
        });
      }
    };
  }, [selectedChatId]);

  const scrollToBottomIfSentByLoggedInUser = (chatMessage) => {
    if (chatMessage.sender.id === loggedInUser.user.userId) {
      bottomOfScrollerRef.current.scrollIntoView();
    }
  };

  const incrementUnreadCountIfSentByOppositeUser = (chatMessage) => {
    if (chatMessage.sender.id !== loggedInUser.user.userId) {
      const bottomScrollTop = isSafari ? 0 : scrollerRef.current.scrollHeight - scrollerRef.current.clientHeight;
      if (scrollerRef.current.scrollTop < bottomScrollTop) {
        setUnreadCount((unreadCount) => unreadCount + 1);
      }
    }
  };

  /**
   * Callback function that is called when:
   * i) fetching the initial batch of chat messages
   * ii) when new chat messages are received
   */
  const updateChatMessages = (chatMessageDoc) => {
    let isNewlySentMessage = false;
    setChatMessageDocs((prevChatMessageDocs) => {
      const newChatMessage = chatMessageDoc.data();
      const lastChatMessageDoc = prevChatMessageDocs[prevChatMessageDocs.length - 1];
      const firstChatMessageDoc = prevChatMessageDocs[0];

      // insert chat message doc to the front if no messages or the message is an older message
      if (
        !firstChatMessageDoc ||
        firstChatMessageDoc.data().dateTime.toMillis() >= newChatMessage.dateTime.toMillis()
      ) {
        return [chatMessageDoc, ...prevChatMessageDocs];
      }

      if (lastChatMessageDoc.data().dateTime.toMillis() <= newChatMessage.dateTime.toMillis()) {
        // insert chat message doc to the back if it is a newly sent message
        isNewlySentMessage = true;
        return [...prevChatMessageDocs, chatMessageDoc];
      } else {
        // insert chat message doc to the correct position if not newly sent message
        // note: this occurs when there are concurrency issues when sending and receiving messages
        for (let i = prevChatMessageDocs.length - 1; i >= 0; i--) {
          const currMessage = prevChatMessageDocs[i].data();
          if (newChatMessage.dateTime.toMillis() > currMessage.dateTime.toMillis()) {
            return [...prevChatMessageDocs.slice(0, i + 1), chatMessageDoc, ...prevChatMessageDocs.slice(i + 1)];
          }
        }
      }
    });
    if (isNewlySentMessage) {
      scrollToBottomIfSentByLoggedInUser(chatMessageDoc.data());
      incrementUnreadCountIfSentByOppositeUser(chatMessageDoc.data());
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
    if (chatMessageDocs.length === 0) {
      return; // assuming that you can see more after loading the initial batch
    }
    setIsLoadingMore(true);
    api.chats.getChatMessages(selectedChatId, chatMessageDocs[0]).then((rawNewChatMessages) => {
      // need to reverse the new chat message docs since the order of the array is latest -> oldest, but in our
      // array the order is oldest -> latest
      const newChatMessageDocs = rawNewChatMessages.docs.reverse();
      setChatMessageDocs([...newChatMessageDocs, ...chatMessageDocs]);
      if (newChatMessageDocs.length < CHAT_MESSAGES_BATCH_SIZE) {
        // loaded all chat messages
        setShouldSeeMore(false);
      }
      setIsLoadingMore(false);
    });
  };

  /**
   * Handler to show the scroller button if scroll position is not at the bottom
   */
  const scrollHandler = () => {
    // note:
    // safari browsers' bottom has scrollTop of 0, negative values when scroll up
    // other browsers' bottom has scrollTop of scrollHeight - clientHeight
    const bottomScrollTop = isSafari ? 0 : scrollerRef.current.scrollHeight - scrollerRef.current.clientHeight;
    if (scrollerRef.current.scrollTop < bottomScrollTop) {
      setIsShowScrollerButton(true);
    } else {
      setIsShowScrollerButton(false);
      setUnreadCount(0);
    }
  };

  // get all heights of components within the chatDialog, only inputRowHeight is passed in as
  // the height is not constant
  const { chatDialogBackButton, chatDialogSeePostRow, chatDialogUserRow, chatDialogMessagesPadding } = isTablet
    ? desktopHeights
    : mobileHeights;

  let sumOfOtherComponentHeights = chatDialogBackButton + chatDialogMessagesPadding + inputRowHeight;

  if (isShowPostDetails) {
    // only add the heights of see post row and user row if it is going to be shown
    sumOfOtherComponentHeights += chatDialogSeePostRow + chatDialogUserRow;
  }

  const offsetHeight = navBarHeight + sumOfOtherComponentHeights;

  // display tips before first message is being sent for a wish
  if (isNewChat && !selectedChatId && postType === wishes) {
    return (
      <CardSection>
        <MessageContainer offsetHeight={offsetHeight} viewportHeight={viewportHeight}>
          <NewChatTips postType={postType} />
        </MessageContainer>
      </CardSection>
    );
  }

  return (
    <CardSection>
      <MessageContainer
        offsetHeight={offsetHeight}
        viewportHeight={viewportHeight}
        onScroll={scrollHandler}
        ref={scrollerRef}
      >
        <InfiniteScroll
          loadMore={handleOnSeeMore}
          hasMore={shouldSeeMore && !isLoadingMore}
          isReverse
          initialLoad={false}
          useWindow={false}
          loader={<Loading type="pageLoader" key={0} />}
        >
          <Stack direction="column">
            {chatMessageDocs &&
              chatMessageDocs.map((messageDoc) => {
                const message = messageDoc.data();
                const { sender, content, dateTime } = message;
                // right side is logged in user's messages, left side is opposite user's
                return sender.id === loggedInUser.user.userId ? (
                  <RightMessageSection
                    key={`${messageDoc.id}`}
                    message={message}
                    loggedInUser={loggedInUser}
                    selectedChatId={selectedChatId}
                    offsetHeight={offsetHeight}
                  />
                ) : (
                  <LeftMessageSection
                    key={`${messageDoc.id}`}
                    message={message}
                    loggedInUser={loggedInUser}
                    selectedChatId={selectedChatId}
                    offsetHeight={offsetHeight}
                  />
                );
              })}
            <ChatDialogFloatingButtons postType={postType} postId={postId} />
          </Stack>
          <div ref={bottomOfScrollerRef} />
        </InfiniteScroll>
      </MessageContainer>
      {isShowScrollerButton && (
        <ScrollToBottomContainer>
          <ScrollerButtonContainer>
            <Button
              circled
              transparent
              iconLeft={<ChevronDown />}
              asComponent={ScrollToBottomButton}
              onClick={() => bottomOfScrollerRef.current.scrollIntoView({ behavior: 'smooth' })}
            ></Button>
          </ScrollerButtonContainer>
          {unreadCount > 0 && (
            <NotificationBadgeWrapper>
              <NotificationBadge type="info">{unreadCount}</NotificationBadge>
            </NotificationBadgeWrapper>
          )}
        </ScrollToBottomContainer>
      )}
    </CardSection>
  );
};

export default ChatDialogMessages;
