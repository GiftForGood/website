import React, { useState, useEffect } from 'react';
import { Grid } from '@kiwicom/orbit-components/lib';
import ListOfChats from '../modules/ListOfChats';
import ChatDialog from '../modules/ChatDialog';
import api from '../../../../utils/api';
import Error from 'next/error';
import styled from 'styled-components';
import { EMAIL_BAR_HEIGHT, NAVBAR_HEIGHT } from '../../../../utils/constants/navbar';
import { useRouter } from 'next/router';
import useMediaQuery from '@kiwicom/orbit-components/lib/hooks/useMediaQuery';

const NoChatsContainer = styled.div`
  margin: 0 auto;
  margin-top: 40vh;
  width: fit-content;
`;

const ChatPage = ({ user, chatId, postId, postType, isViewingChatsForMyPost }) => {
  const hasSelectedAChat = typeof chatId !== 'undefined' && chatId !== null;
  const [selectedChatId, setSelectedChatId] = useState(hasSelectedAChat ? chatId : null);
  const [isNewChat, setIsNewChat] = useState(chatId == null);
  const [hasNoChatForOwnPost, setHasNoChatForOwnPost] = useState(true);
  const [hasError, setHasError] = useState(false);
  const router = useRouter();

  // error checking for selected chat
  useEffect(() => {
    if (chatId) {
      api.chats
        .getChat(chatId)
        .then((rawChat) => {
          // Check if chat exists
          if (!rawChat.exists) {
            setHasError(true);
            return;
          }
          const chat = rawChat.data();
          // Check if logged in user is part of the chat
          if (chat.npo.id !== user.user.userId && chat.donor.id !== user.user.userId) {
            setHasError(true);
            return;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  // error checking for viewing chats for a post
  useEffect(() => {
    if (postId) {
      api.chats.getChatsForPost(postId).then((rawChats) => {
        setIsNewChat(rawChats.docs.length === 0);

        if (isViewingChatsForMyPost && rawChats.docs.length === 0) {
          setHasNoChatForOwnPost(true);
        } else {
          setHasNoChatForOwnPost(false);
        }

        if (!isViewingChatsForMyPost && rawChats.docs.length > 0) {
          const chat = rawChats.docs[0].data(); // assumption: should only have one chat since the chat is for another user's post
          router.push(`/chat/[chatId]`, `/chat/${chat.chatId}?postId=${postId}&postType=${postType}`, {
            shallow: true,
          });
        }
      });
    } else {
      setHasNoChatForOwnPost(false);
    }
  }, []);

  const { isTablet } = useMediaQuery();
  const navBarConstant = isTablet ? 'DESKTOP' : 'MOBILE';
  const navBarOffsetHeight = user
    ? user.user.emailVerified
      ? NAVBAR_HEIGHT[navBarConstant]
      : NAVBAR_HEIGHT[navBarConstant] + EMAIL_BAR_HEIGHT[navBarConstant]
    : NAVBAR_HEIGHT[navBarConstant];

  const gridContainerStyle = {
    height: `calc(100vh - ${navBarOffsetHeight}px)`,
    width: '100vw',
  };

  const ChatPageTabletAndDesktop = () => {
    return (
      <Grid style={gridContainerStyle} columns="1fr 3fr">
        <ListOfChats
          user={user}
          selectedChatId={selectedChatId}
          setSelectedChatId={setSelectedChatId}
          postId={postId}
          isCreatingNewChat={isNewChat}
          isViewingChatsForMyPost={isViewingChatsForMyPost}
        />
        <ChatDialog
          loggedInUser={user}
          selectedChatId={selectedChatId}
          setSelectedChatId={setSelectedChatId}
          navBarHeight={navBarOffsetHeight}
          isNewChat={isNewChat}
          setIsNewChat={setIsNewChat}
          postId={postId}
          postType={postType}
        />
      </Grid>
    );
  };

  const ChatPageMobile = () => {
    return (
      <Grid style={gridContainerStyle} columns="1fr">
        {selectedChatId == null && !isNewChat ? (
          <ListOfChats
            user={user}
            selectedChatId={selectedChatId}
            setSelectedChatId={setSelectedChatId}
            postId={postId}
            isViewingChatsForMyPost={isViewingChatsForMyPost}
          />
        ) : (
          <ChatDialog
            loggedInUser={user}
            selectedChatId={selectedChatId}
            setSelectedChatId={setSelectedChatId}
            navBarHeight={navBarOffsetHeight}
            isNewChat={isNewChat}
            setIsNewChat={setIsNewChat}
            postId={postId}
            postType={postType}
          />
        )}
      </Grid>
    );
  };

  if (hasError) {
    return <Error />;
  }

  if (hasNoChatForOwnPost && isViewingChatsForMyPost) {
    return <NoChatsContainer>No chats for this post yet.</NoChatsContainer>;
  }

  return isTablet ? <ChatPageTabletAndDesktop /> : <ChatPageMobile />;
};

export default ChatPage;
