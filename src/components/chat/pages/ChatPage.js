import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Grid } from '@kiwicom/orbit-components/lib';
import ListOfChats from '../modules/ListOfChats';
import ChatDialog from '../modules/ChatDialog';
import api from '../../../../utils/api';
import styled from 'styled-components';
import { EMAIL_BAR_HEIGHT, NAVBAR_HEIGHT } from '../../../../utils/constants/navbar';
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
  const router = useRouter();

  useEffect(() => {
    // only get chats for post if postId query is given
    if (postId) {
      api.chats.getChatsForPost(postId).then((rawChats) => {
        setIsNewChat(rawChats.docs.length === 0);

        if (isViewingChatsForMyPost && rawChats.docs.length === 0) {
          setHasNoChatForOwnPost(true);
        } else {
          setHasNoChatForOwnPost(false);
        }

        // if continue to chat with a post that is not yours, automatically select chat and show the messsages
        // note: assumes that you can only have one chat with a post that is not yours
        if (!isViewingChatsForMyPost && rawChats.docs.length > 0) {
          setSelectedChatId(rawChats.docs[0].data().chatId);
        }
      });
    } else {
      setHasNoChatForOwnPost(false);
    }
  }, []);

  useEffect(() => {
    // modify url based on selected chat id
    // note: with a selected chat id, the url can only be in the form of '/chat?chatId=[chatId]' or '/chat?chatId=[chatId]&postId=[postId]'
    if (selectedChatId && router.query.chatId !== selectedChatId) {
      const queries = isNewChat ? `chatId=${selectedChatId}` : `postId=${router.query.postId}&chatId=${selectedChatId}`;
      const routeWithUpdatedChatId = `/chat?${queries}`;
      router.push(router.asPath, routeWithUpdatedChatId, {
        shallow: true,
      });
    }
  }, [selectedChatId]);

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

  if (hasNoChatForOwnPost && isViewingChatsForMyPost) {
    return <NoChatsContainer>No chats for this post yet.</NoChatsContainer>;
  }

  return isTablet ? <ChatPageTabletAndDesktop /> : <ChatPageMobile />;
};

export default ChatPage;
