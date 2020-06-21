import React, { useState, useEffect } from 'react';
import { Stack, ButtonLink } from '@kiwicom/orbit-components/lib';
import ChatDialogUserRow from './ChatDialogUserRow';
import ChatDialogViewPostRow from './ChatDialogViewPostRow';
import ChatDialogMessages from './ChatDialogMessages';
import ChatDialogInputRow from './ChatDialogInputRow';
import BlackText from '../../text/BlackText';
import api from '../../../../utils/api';
import styled from 'styled-components';
import ChevronLeft from '@kiwicom/orbit-components/lib/icons/ChevronLeft';
import useMediaQuery from '@kiwicom/orbit-components/lib/hooks/useMediaQuery';

const ChatDialogContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const MessageContainer = styled.div`
  width: fit-content;
  margin: 0 auto;
  margin-top: 40vh;
`;

const ChatDialogContent = ({
  loggedInUser,
  navBarHeight,
  selectedChatId,
  setSelectedChatId,
  isNewChat,
  setIsNewChat,
  post,
  chat,
  postId,
  postType,
}) => {
  const { isTablet } = useMediaQuery();
  let title, oppositeUserName, oppositeUserProfileImageUrl;
  if (post == null || typeof post == 'undefined') {
    title = chat.post.title;
    const oppositeUser = chat.npo.id === loggedInUser.user.userId ? chat.donor : chat.npo;
    oppositeUserName = oppositeUser.name;
    oppositeUserProfileImageUrl = oppositeUser.profileImageUrl;
  } else {
    title = post.title;
    oppositeUserName = post.user.userName;
    oppositeUserProfileImageUrl = post.user.profileImageUrl;
  }
  return (
    <>
      <Stack direction="column" spacing="none">
        {!isTablet && (
          <ButtonLink
            onClick={function () {
              setSelectedChatId(null);
            }}
            iconLeft={<ChevronLeft />}
            transparent
            type="secondary"
          />
        )}
        <ChatDialogUserRow
          postId={postId}
          postType={postType}
          rating={5} // apparently rating is not within the user in donations/wishes, default val for now
          name={oppositeUserName}
          profileImageUrl={oppositeUserProfileImageUrl}
          selectedChatId={selectedChatId}
          setSelectedChatId={setSelectedChatId}
          isNewChat={isNewChat}
          setIsNewChat={setIsNewChat}
        />
        <ChatDialogViewPostRow
          postType={selectedChatId ? chat.post.type : postType}
          postId={selectedChatId ? chat.post.id : postId}
          postTitle={title}
        />
        <ChatDialogMessages
          loggedInUser={loggedInUser}
          selectedChatId={selectedChatId}
          isNewChat={isNewChat}
          navBarHeight={navBarHeight}
        />
      </Stack>
      <ChatDialogInputRow
        selectedChatId={selectedChatId}
        setSelectedChatId={setSelectedChatId}
        isNewChat={isNewChat}
        setIsNewChat={setIsNewChat}
        postType={postType}
        postId={postId}
      />
    </>
  );
};

const ChatDialog = ({
  loggedInUser,
  selectedChatId,
  setSelectedChatId,
  navBarHeight,
  isNewChat,
  setIsNewChat,
  postId,
  postType,
}) => {
  const [post, setPost] = useState(null); // note that the post is only needed when creating a new chat for a post
  const [chat, setChat] = useState(null);
  useEffect(() => {
    // when creating a new chat
    if (postId && isNewChat) {
      api[postType].get(postId).then((rawPost) => {
        setPost(rawPost.data());
      });
    } else if (selectedChatId) {
      // when a chat has been selected
      api.chats.getChat(selectedChatId).then((rawChat) => {
        setChat(rawChat.data());
      });
    }
  }, []);

  // no chat selected yet and is not creating a new chat for a post
  if (selectedChatId == null && !isNewChat) {
    return (
      <ChatDialogContainer>
        <MessageContainer>
          <BlackText>Select a chat to view the messages.</BlackText>
        </MessageContainer>
      </ChatDialogContainer>
    );
  }

  // if creating new post, but the post hasn't been populated yet
  if (post == null && postId && isNewChat) {
    return null;
  }

  // if not creating new post, but the chat hasn't been populated yet
  if (!isNewChat && chat == null) {
    return null;
  }

  return (
    <ChatDialogContainer>
      <ChatDialogContent
        loggedInUser={loggedInUser}
        navBarHeight={navBarHeight}
        selectedChatId={selectedChatId}
        setSelectedChatId={setSelectedChatId}
        isNewChat={isNewChat}
        setIsNewChat={setIsNewChat}
        post={post}
        chat={chat}
        postId={postId}
        postType={postType}
      />
    </ChatDialogContainer>
  );
};

export default ChatDialog;
