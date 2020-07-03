import React, { useState, useEffect } from 'react';
import { Stack, TileGroup, Loading } from '@kiwicom/orbit-components/lib';
import ChatWithUserCard from '../../card/ChatWithUserCard';
import api from '../../../../utils/api';
import styled, { css } from 'styled-components';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';
import { colors } from '../../../../utils/constants/colors';
import { MODIFIED, ADDED } from '../../../../utils/constants/chatSubscriptionChange';
import InfiniteScroll from 'react-infinite-scroller';
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
`;

const ListOfChats = ({ user, selectedChatId, setSelectedChatId, postId, isViewingChatsForMyPost }) => {
  const [chatDocs, setChatDocs] = useState([]);
  const [shouldSeeMore, setShouldSeeMore] = useState(true);

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
        api.chats
          .unsubscribeToChats(unsubscribeFunction)
          .then(() => console.log('unsubscribed from chats successfully'));
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
        return prevChatDocs;
      });
    }
  };

  /**
   * Check if the new chat is the latest chat, i.e. should be on top of all existing chats
   */
  const isLatestNewChat = (newChatDoc, existingChatDocs) => {
    return (
      existingChatDocs.length === 0 ||
      newChatDoc.data().lastMessage.dateTime > existingChatDocs[0].data().lastMessage.dateTime
    );
  };

  /**
   * A hacky way to determine if we should load more after the first batch,
   * since the subscription method does not tell whether the first load of chats
   * are less than one USER_CHATS_BATCH_SIZE
   */
  const disableFurtherLoadsIfChatsLessThanOneBatch = () => {
    if (isViewingChatsForMyPost) {
      api.chats.getChatsForPost(postId).then((rawChats) => {
        const newChatDocs = rawChats.docs;
        if (newChatDocs.length < USER_CHATS_BATCH_SIZE) {
          setShouldSeeMore(false);
        }
      });
    } else {
      api.chats.getChats().then((rawChats) => {
        const newChatDocs = rawChats.docs;
        if (newChatDocs.length < USER_CHATS_BATCH_SIZE) {
          setShouldSeeMore(false);
        }
      });
    }
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

  return (
    <ListOfChatsContainer>
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
                    lastMessage={lastMessage.content}
                    contentType={lastMessage.contentType}
                    profileImageUrl={profileImageUrl}
                    post={post}
                    isSelected={isSelected}
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
