import React, { useState, useEffect } from 'react';
import { Stack, TileGroup, Loading } from '@kiwicom/orbit-components/lib';
import ChatWithUserCard from '../../card/ChatWithUserCard';
import api from '../../../../utils/api';
import styled, { css } from 'styled-components';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';
import { colors } from '../../../../utils/constants/colors';
import { MODIFIED, ADDED } from '../../../../utils/constants/chatSubscriptionChange';
import InfiniteScroll from '../../scroller/InfiniteScroller';
import { USER_CHATS_BATCH_SIZE } from '../../../../utils/api/constants';

const ListOfChatsContainer = styled.div`
  min-width: 200px;
  ${media.tablet(css`
    min-width: 300px;
  `)}
  ${media.desktop(css`
    min-width: 350px;
  `)}
  max-height: 100vh;
  overflow-y: scroll;
  border-right: 1px solid ${colors.chatBorders};
  display: ${({ isShow }) => {
    return isShow ? 'unset' : 'none';
  }};
`;

const EmptyChatContainer = styled.div`
  height: 100%;
  width: 100%;
  border-right: 1px solid ${colors.chatBorders};
`;

const EmptyChatTextContainer = styled.div`
  width: fit-content;
  margin: 0 auto;
  margin-top: 40vh;
`;

const ListOfChats = ({
  user,
  selectedChatId,
  setSelectedChatId,
  postId,
  isNewChat,
  setIsNewChat,
  isViewingChatsForMyPost,
  isShow,
}) => {
  const [chatDocs, setChatDocs] = useState([]);
  const [shouldSeeMore, setShouldSeeMore] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    let unsubscribeFunction;
    if (isViewingChatsForMyPost) {
      api.chats.subscribeToChatsForPost(postId, updateChats).then((fn) => {
        unsubscribeFunction = fn;
      });
    } else {
      api.chats.subscribeToChats(updateChats).then((fn) => (unsubscribeFunction = fn));
    }
    disableFurtherLoadsIfChatsLessThanOneBatch();

    return () => {
      if (unsubscribeFunction) {
        api.chats.unsubscribeToChats(unsubscribeFunction).then(() => {});
      }
    };
  }, []);

  const updateChats = (changeType, changedDoc) => {
    if (changeType === ADDED) {
      setChatDocs((prevChatDocs) => {
        if (isLatestNewChat(changedDoc, prevChatDocs)) {
          return [changedDoc, ...prevChatDocs];
        }
        return [...prevChatDocs, changedDoc];
      });
    }

    if (changeType === MODIFIED) {
      // need to get modified chat to first position
      setChatDocs((prevChatDocs) => {
        const chatDocsWithModifiedChatRemoved = prevChatDocs.filter(
          (chat) => chat.data().chatId !== changedDoc.data().chatId
        );
        if (isLatestNewChat(changedDoc, chatDocsWithModifiedChatRemoved)) {
          return [changedDoc, ...chatDocsWithModifiedChatRemoved];
        }

        // replace chat to the corresponding position
        const matchingIndex = prevChatDocs.findIndex((chatDoc) => chatDoc.data().chatId === changedDoc.data().chatId);
        return [...prevChatDocs.slice(0, matchingIndex), changedDoc, ...prevChatDocs.slice(matchingIndex + 1)];
      });
    }
  };

  /**
   * Check if the new chat is the latest chat, i.e. should be on top of all existing chats
   */
  const isLatestNewChat = (newChatDoc, existingChatDocs) => {
    return (
      existingChatDocs.length === 0 ||
      newChatDoc.data().lastMessage.dateTime.toMillis() > existingChatDocs[0].data().lastMessage.dateTime.toMillis()
    );
  };

  /**
   * A hacky way to determine if we should load more after the first batch,
   * since the subscription method does not tell whether the first load of chats
   * are less than one USER_CHATS_BATCH_SIZE
   */
  const disableFurtherLoadsIfChatsLessThanOneBatch = () => {
    const getChats = async () => {
      return isViewingChatsForMyPost ? api.chats.getChatsForPost(postId) : api.chats.getChats();
    };

    getChats().then((rawChats) => {
      const newChatDocs = rawChats.docs;
      if (newChatDocs.length < USER_CHATS_BATCH_SIZE) {
        setShouldSeeMore(false);
      }
      setIsMounted(true);
    });
  };

  const handleOnSeeMore = () => {
    if (isViewingChatsForMyPost) {
      api.chats.getChatsForPost(postId, chatDocs[chatDocs.length - 1]).then((rawChats) => {
        const newChatDocs = rawChats.docs;
        if (newChatDocs.length < USER_CHATS_BATCH_SIZE) {
          setShouldSeeMore(false);
        }
        setChatDocs([...chatDocs, ...newChatDocs]);
      });
    } else {
      api.chats.getChats(chatDocs[chatDocs.length - 1]).then((rawChats) => {
        const newChatDocs = rawChats.docs;
        if (newChatDocs.length < USER_CHATS_BATCH_SIZE) {
          setShouldSeeMore(false);
        }
        setChatDocs([...chatDocs, ...newChatDocs]);
      });
    }
  };

  if (isMounted && chatDocs.length === 0) {
    return (
      <EmptyChatContainer>
        <EmptyChatTextContainer>No chats available.</EmptyChatTextContainer>
      </EmptyChatContainer>
    );
  }

  return (
    <ListOfChatsContainer isShow={isShow}>
      <InfiniteScroll
        loadMore={handleOnSeeMore}
        hasMore={shouldSeeMore}
        initialLoad={false}
        useWindow={false}
        loader={<Loading type="pageLoader" key={0} />}
      >
        <Stack direction="column" spacing="none">
          <TileGroup>
            {chatDocs &&
              chatDocs.map((chat) => {
                const { chatId, donor, npo, lastMessage, post } = chat.data();
                // get opposite user's details
                const { name, profileImageUrl } = user.user.userId === donor.id ? npo : donor;

                // get unread count of my own chat
                const { unreadCount } = user.user.userId === donor.id ? donor : npo;
                const isSelected = selectedChatId === chatId;
                return (
                  <ChatWithUserCard
                    key={chatId}
                    chatId={chatId}
                    name={name}
                    lastMessage={lastMessage}
                    profileImageUrl={profileImageUrl}
                    post={post}
                    isSelected={isSelected}
                    isNewChat={isNewChat}
                    setIsNewChat={setIsNewChat}
                    isViewingChatsForMyPost={isViewingChatsForMyPost}
                    setSelectedChatId={setSelectedChatId}
                    unreadCount={unreadCount}
                  />
                );
              })}
          </TileGroup>
        </Stack>
      </InfiniteScroll>
    </ListOfChatsContainer>
  );
};

export default ListOfChats;
