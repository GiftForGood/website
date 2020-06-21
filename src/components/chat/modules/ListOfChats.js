import React, { useState, useEffect } from 'react';
import { Stack, TileGroup } from '@kiwicom/orbit-components/lib';
import ChatWithUserCard from '../../card/ChatWithUserCard';
import api from '../../../../utils/api';
import styled, { css } from 'styled-components';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';
import { colors } from '../../../../utils/constants/colors';
import { MODIFIED, ADDED } from '../../../../utils/constants/chatSubscriptionChange';
import { donations, wishes } from '../../../../utils/constants/postType';

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

const ListOfChats = ({ user, setSelectedChatId, isNewChat, postId, postType, isViewingChatsForMyPost }) => {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    let unsubscribeFunction;
    if (isViewingChatsForMyPost) {
      api.chats.subscribeToChatsForPost(postId, updateChats).then((fn) => {
        unsubscribeFunction = fn;
      });
    } else {
      api.chats.subscribeToChats(updateChats).then((fn) => (unsubscribeFunction = fn));
    }

    return () => {
      // TODO: unsubscribe to chats
      // api.chats.unsubscribeToChats(unsubscribeFunction).then(() => console.log('unsubscribed from chats'));
    };
  }, []);

  const updateChats = (changeType, changedDoc) => {
    if (changeType === ADDED) {
      setChats((prevChats) => {
        return [...prevChats, changedDoc.data()];
      });
    }

    if (changeType === MODIFIED) {
      // need to get modified chat to first position
      setChats((prevChats) => {
        const chatsWithModifiedChatRemoved = prevChats.filter((chat) => chat.chatId !== changedDoc.data().chatId);
        if (
          chatsWithModifiedChatRemoved.length == 0 ||
          changedDoc.data().lastMessage.dateTime > chatsWithModifiedChatRemoved[0].lastMessage.dateTime
        ) {
          return [changedDoc.data(), ...chatsWithModifiedChatRemoved];
        }
        return prevChats;
      });
    }
  };

  const getNextBatchOfChats = () => {
    if (isViewingChatsForMyPost) {
      api.chats.getChatsForPost(postId, chats[chats.length - 1]).then((rawChats) => {
        const newChats = rawChats.docs.map((rawChat) => rawChat.data());
        setChats([...chats, ...newChats]);
      });
    } else {
      api.chats.getChats(chats[chats.length - 1]).then((rawChats) => {
        const newChats = rawChats.docs.map((rawChat) => rawChat.data());
        setChats([...chats, ...newChats]);
      });
    }
  };

  return (
    <ListOfChatsContainer>
      <Stack direction="column" spacing="none">
        <TileGroup>
          {chats.map((chat) => {
            const { chatId, donor, npo, lastMessage, post } = chat;
            // get opposite user's details
            const { name, profileImageUrl } = user.user.userId === donor.id ? npo : donor;
            return (
              <ChatWithUserCard
                key={chatId}
                chatId={chatId} // initial dummy value
                name={name}
                lastMessage={lastMessage.content}
                contentType={lastMessage.contentType}
                profileImageUrl={profileImageUrl}
                postTitle={post.title}
                setSelectedChatId={setSelectedChatId}
              />
            );
          })}
        </TileGroup>
      </Stack>
    </ListOfChatsContainer>
  );
};

export default ListOfChats;
