import React, { useState, useEffect } from 'react';
import { Grid } from '@kiwicom/orbit-components/lib';
import ListOfChats from '../modules/ListOfChats';
import ChatDialog from '../modules/ChatDialog';
import api from '../../../../utils/api';
import Error from 'next/error';
import styled from 'styled-components';
import { EMAIL_BAR_HEIGHT, NAVBAR_HEIGHT } from '../../../../utils/constants/navbar';
import useMediaQuery from '@kiwicom/orbit-components/lib/hooks/useMediaQuery';
import Router from 'next/router';
import useWindowDimensions from '../../../../utils/hooks/useWindowDimensions';

const NoChatsContainer = styled.div`
  margin: 0 auto;
  margin-top: 40vh;
  width: fit-content;
`;

const ChatPageTabletAndDesktop = ({
  user,
  setHasError,
  selectedChatId,
  setSelectedChatId,
  postId,
  postType,
  isNewChat,
  setIsNewChat,
  isViewingChatsForMyPost,
  navBarHeight,
  gridContainerStyle,
}) => {
  return (
    <Grid style={gridContainerStyle} columns="1fr 3fr">
      <ListOfChats
        user={user}
        selectedChatId={selectedChatId}
        setSelectedChatId={setSelectedChatId}
        postId={postId}
        isNewChat={isNewChat}
        setIsNewChat={setIsNewChat}
        isViewingChatsForMyPost={isViewingChatsForMyPost}
        isShow={true}
      />
      <ChatDialog
        loggedInUser={user}
        setHasError={setHasError}
        selectedChatId={selectedChatId}
        setSelectedChatId={setSelectedChatId}
        navBarHeight={navBarHeight}
        isNewChat={isNewChat}
        setIsNewChat={setIsNewChat}
        postId={postId}
        postType={postType}
        isShow={true}
      />
    </Grid>
  );
};

const ChatPageMobile = ({
  user,
  setHasError,
  selectedChatId,
  setSelectedChatId,
  postId,
  postType,
  isNewChat,
  setIsNewChat,
  isViewingChatsForMyPost,
  navBarHeight,
  gridContainerStyle,
}) => {
  return (
    <Grid style={gridContainerStyle} columns="1fr">
      {/* Using the isShow props to conditionally display ListOfChats when has not selected a chat */}
      <ListOfChats
        user={user}
        selectedChatId={selectedChatId}
        setSelectedChatId={setSelectedChatId}
        isNewChat={isNewChat}
        setIsNewChat={setIsNewChat}
        postId={postId}
        isViewingChatsForMyPost={isViewingChatsForMyPost}
        isShow={selectedChatId === null && !isNewChat}
      />
      <ChatDialog
        loggedInUser={user}
        setHasError={setHasError}
        selectedChatId={selectedChatId}
        setSelectedChatId={setSelectedChatId}
        navBarHeight={navBarHeight}
        isNewChat={isNewChat}
        setIsNewChat={setIsNewChat}
        postId={postId}
        postType={postType}
        isShow={selectedChatId !== null || isNewChat}
      />
    </Grid>
  );
};

const ChatPage = ({ user, chatId, postId, postType, isViewingChatsForMyPost }) => {
  const hasSelectedAChat = typeof chatId !== 'undefined' && chatId !== null;
  const [selectedChatId, setSelectedChatId] = useState(hasSelectedAChat ? chatId : null);
  const [isNewChat, setIsNewChat] = useState(false);
  const [hasNoChatForOwnPost, setHasNoChatForOwnPost] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const checkIfSelectedChatHasError = (rawChat) => {
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
  };

  const setChatPropertiesForPost = (rawChats) => {
    setIsNewChat(rawChats.docs.length === 0);

    if (isViewingChatsForMyPost && rawChats.docs.length === 0) {
      setHasNoChatForOwnPost(true);
    } else {
      setHasNoChatForOwnPost(false);
    }
  };

  const initialChecks = async () => {
    if (selectedChatId) {
      const rawChat = await api.chats.getChat(selectedChatId);
      checkIfSelectedChatHasError(rawChat);
      setHasNoChatForOwnPost(false);
    } else if (postId) {
      const rawChatsForPost = await api.chats.getChatsForPost(postId);
      setChatPropertiesForPost(rawChatsForPost);
    } else {
      setHasNoChatForOwnPost(false);
    }
  };

  useEffect(() => {
    // handle changes in url param `chatId`, when clicked on back/forward button
    const handleRouteChange = () => {
      if (typeof window === 'undefined') {
        return;
      }
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const chatIdParam = urlParams.get('chatId');
      if (chatIdParam !== selectedChatId) {
        setSelectedChatId(chatIdParam);
      }
    };

    Router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      Router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [selectedChatId]); // compare url param with the most recently updated selectedChatId

  useEffect(() => {
    initialChecks().then(() => setIsMounted(true));
  }, [selectedChatId]);

  const { isTablet } = useMediaQuery();
  const { height } = useWindowDimensions();
  const navBarConstant = isTablet ? 'DESKTOP' : 'MOBILE';
  const navBarOffsetHeight = user
    ? user.user.emailVerified
      ? NAVBAR_HEIGHT[navBarConstant]
      : NAVBAR_HEIGHT[navBarConstant] + EMAIL_BAR_HEIGHT[navBarConstant]
    : NAVBAR_HEIGHT[navBarConstant];

  const gridContainerStyle = {
    height: `${height - navBarOffsetHeight}px`,
    width: '100vw',
  };

  if (hasError) {
    return <Error />;
  }

  if (!isMounted) {
    return null;
  }

  if (hasNoChatForOwnPost && isViewingChatsForMyPost) {
    return <NoChatsContainer>No chats for this post yet.</NoChatsContainer>;
  }

  return isTablet ? (
    <ChatPageTabletAndDesktop
      user={user}
      setHasError={setHasError}
      selectedChatId={selectedChatId}
      setSelectedChatId={setSelectedChatId}
      postId={postId}
      postType={postType}
      isNewChat={isNewChat}
      setIsNewChat={setIsNewChat}
      isViewingChatsForMyPost={isViewingChatsForMyPost}
      navBarHeight={navBarOffsetHeight}
      gridContainerStyle={gridContainerStyle}
    />
  ) : (
    <ChatPageMobile
      user={user}
      setHasError={setHasError}
      selectedChatId={selectedChatId}
      setSelectedChatId={setSelectedChatId}
      postId={postId}
      postType={postType}
      isNewChat={isNewChat}
      setIsNewChat={setIsNewChat}
      isViewingChatsForMyPost={isViewingChatsForMyPost}
      navBarHeight={navBarOffsetHeight}
      gridContainerStyle={gridContainerStyle}
    />
  );
};

export default ChatPage;
