import React, { useState, useEffect } from 'react';
import Measure from 'react-measure';
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
import { donations } from '../../../../utils/constants/postType';

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
  setHasError,
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
  // default as 68 px which is single line text area, modified when there
  // is more than one line in the text area in input row
  const [inputRowHeight, setInputRowHeight] = useState(68);

  let chatPostTitle, oppositeUser, chatPostType, chatPostId, postOwnerId, postEnquirerId, postStatus;
  const isCreatingNewChatForAPost = postId !== null && isNewChat;
  // obtain post details accordingly
  if (isCreatingNewChatForAPost) {
    // get from post
    chatPostTitle = post.title;
    oppositeUser = post.user;
    postOwnerId = post.user.id;
    postEnquirerId = loggedInUser.user.id;
    chatPostType = postType;
    chatPostId = postId;
    postStatus = post.status;
  } else {
    // get from chat
    chatPostTitle = chat.post.title;
    oppositeUser = chat.npo.id === loggedInUser.user.userId ? chat.donor : chat.npo;
    chatPostType = chat.post.type;
    chatPostId = chat.post.id;
    postOwnerId = chatPostType === donations ? chat.donor.id : chat.npo.id;
    postEnquirerId = chatPostType === donations ? chat.npo.id : chat.donor.id;
    postStatus = chat.post.status;
  }

  return (
    <>
      <Stack direction="column" spacing="none">
        {!isTablet && (
          <ButtonLink
            onClick={function () {
              setSelectedChatId(null);
              setIsNewChat(false);
            }}
            iconLeft={<ChevronLeft />}
            transparent
            type="secondary"
          />
        )}
        <ChatDialogUserRow
          postId={chatPostId}
          postType={chatPostType}
          postStatus={postStatus}
          rating={5} // apparently rating is not within the user in donations/wishes, default val for now
          loggedInUser={loggedInUser}
          oppositeUser={oppositeUser}
          postOwnerId={postOwnerId}
          postEnquirerId={postEnquirerId}
          setHasError={setHasError}
          selectedChatId={selectedChatId}
          setSelectedChatId={setSelectedChatId}
          isNewChat={isNewChat}
          setIsNewChat={setIsNewChat}
        />
        <ChatDialogViewPostRow postType={chatPostType} postId={chatPostId} postTitle={chatPostTitle} />
        <ChatDialogMessages
          postType={chatPostType}
          loggedInUser={loggedInUser}
          selectedChatId={selectedChatId}
          isNewChat={isNewChat}
          navBarHeight={navBarHeight}
          inputRowHeight={inputRowHeight}
        />
      </Stack>
      <Measure bounds onResize={(contentRect) => setInputRowHeight(contentRect.bounds.height)}>
        {({ measureRef }) => (
          <ChatDialogInputRow
            selectedChatId={selectedChatId}
            setSelectedChatId={setSelectedChatId}
            isNewChat={isNewChat}
            setIsNewChat={setIsNewChat}
            postType={chatPostType}
            postId={chatPostId}
            ref={measureRef}
          />
        )}
      </Measure>
    </>
  );
};

const ChatDialog = ({
  loggedInUser,
  setHasError,
  selectedChatId,
  setSelectedChatId,
  navBarHeight,
  isNewChat,
  setIsNewChat,
  postId,
  postType,
}) => {
  /**
   * note that the post is only needed when creating a new chat for a post, in order to get
   * details of the post, since there's no chat to reference to get the post data from.
   */
  const [post, setPost] = useState(null);

  /**
   * note that chat is used to obtain the details of the post, when there's already existing
   * messages for that chat.
   */
  const [chat, setChat] = useState(null);

  const isCreatingNewChatForAPost = postId && isNewChat;
  const hasSelectedChat = selectedChatId !== null;

  useEffect(() => {
    // when creating a new chat
    if (isCreatingNewChatForAPost) {
      api[postType].get(postId).then((rawPost) => {
        setPost(rawPost.data());
      });
    } else if (hasSelectedChat) {
      // when a chat has been selected
      api.chats.getChat(selectedChatId).then((rawChat) => {
        setChat(rawChat.data());
      });
    }
  }, [selectedChatId]);

  // no chat selected yet and is not creating a new chat for a post
  if (!hasSelectedChat && !isNewChat) {
    return (
      <ChatDialogContainer>
        <MessageContainer>
          <BlackText>Select a chat to view the messages.</BlackText>
        </MessageContainer>
      </ChatDialogContainer>
    );
  }

  // when creating new post, but the post hasn't been populated yet
  if (post == null && isCreatingNewChatForAPost) {
    return null;
  }

  // when not creating new chat, but the chat hasn't been populated yet
  if (!isCreatingNewChatForAPost && chat == null) {
    return null;
  }

  return (
    <ChatDialogContainer>
      <ChatDialogContent
        loggedInUser={loggedInUser}
        navBarHeight={navBarHeight}
        setHasError={setHasError}
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
