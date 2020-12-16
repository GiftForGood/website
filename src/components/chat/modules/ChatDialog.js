import React, { useState, useEffect, useContext } from 'react';
import Measure from 'react-measure';
import { Stack, ButtonLink, Button } from '@kiwicom/orbit-components/lib';
import ChatDialogUserRow from './ChatDialogUserRow';
import ChatDialogViewPostRow from './ChatDialogViewPostRow';
import ChatDialogMessages from './ChatDialogMessages';
import ChatDialogInputRow from './ChatDialogInputRow';
import BlackText from '../../text/BlackText';
import api from '@api';
import styled from 'styled-components';
import ChevronLeft from '@kiwicom/orbit-components/lib/icons/ChevronLeft';
import ChevronDown from '@kiwicom/orbit-components/lib/icons/ChevronDown';
import ChevronUp from '@kiwicom/orbit-components/lib/icons/ChevronUp';
import useMediaQuery from '@kiwicom/orbit-components/lib/hooks/useMediaQuery';
import { donations } from '@constants/postType';
import ChatContext from '../context';
import { setSelectedChatId, setIsNewChat } from '../actions';
import { getSelectedChatId, getIsNewChat, getPostId, getPostType, getUser } from '../selectors';

const ChatDialogContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: ${({ isShow }) => (isShow ? 'unset' : 'none')};
`;

const MessageContainer = styled.div`
  width: fit-content;
  margin: 0 auto;
  margin-top: 40vh;
`;

const ButtonsWrapper = styled.div`
  margin: 0 auto;
  width: 90%;
`;

const ChatDialogContent = ({ post, chat, setChat }) => {
  const { state, dispatch } = useContext(ChatContext);
  const loggedInUser = getUser(state);
  const isNewChat = getIsNewChat(state);
  const postId = getPostId(state);
  const postType = getPostType(state);

  const { isTablet } = useMediaQuery();
  // default as 68 px which is single line text area, modified when there
  // is more than one line in the text area in input row
  const [inputRowHeight, setInputRowHeight] = useState(68);
  const [isShowPostDetails, setIsShowPostDetails] = useState(isTablet); // hide post details initially if using mobile

  let chatPostTitle, oppositeUser, chatPostType, chatPostId, postOwnerId, postEnquirerId, postStatus, chatStatus;
  const isCreatingNewChatForAPost = postId !== null && isNewChat;
  // obtain post details accordingly
  if (isCreatingNewChatForAPost) {
    // get from post
    chatPostTitle = post.title;
    oppositeUser = post.user;
    postOwnerId = post.user.userId;
    postEnquirerId = loggedInUser.user.userId;
    chatPostType = postType;
    chatPostId = postId;
    postStatus = post.status;
  } else {
    // get from chat
    chatPostTitle = chat.post.title;
    oppositeUser = chat.npo.id === loggedInUser.user.userId ? chat.donor : chat.npo;
    chatPostType = chat.post.type;
    chatPostId = chat.post.id;
    postOwnerId = chat.post.type === donations ? chat.donor.id : chat.npo.id;
    postEnquirerId = chat.post.type === donations ? chat.npo.id : chat.donor.id;
    postStatus = chat.post.status;
    chatStatus = chat.status;
  }

  return (
    <>
      <Stack direction="column" spacing="none">
        {!isTablet && (
          <ButtonsWrapper>
            <Stack direction="row" justify="between" align="center">
              <ButtonLink
                onClick={function () {
                  dispatch(setSelectedChatId(null));
                  dispatch(setIsNewChat(false));
                }}
                iconLeft={<ChevronLeft />}
                transparent
                type="secondary"
              />
              <Button
                iconRight={isShowPostDetails ? <ChevronUp /> : <ChevronDown />}
                onClick={() => setIsShowPostDetails(!isShowPostDetails)}
                size="small"
                style={{ marginRight: '10px' }}
              >
                {isShowPostDetails ? 'Hide Post Details' : 'Show Post Details'}
              </Button>
            </Stack>
          </ButtonsWrapper>
        )}
        {isShowPostDetails && (
          <>
            <ChatDialogUserRow
              postId={chatPostId}
              postType={chatPostType}
              postStatus={postStatus}
              chatStatus={chatStatus}
              oppositeUser={oppositeUser}
              postOwnerId={postOwnerId}
              postEnquirerId={postEnquirerId}
              setChat={setChat}
            />
            <ChatDialogViewPostRow postType={chatPostType} postId={chatPostId} postTitle={chatPostTitle} />
          </>
        )}
        <ChatDialogMessages
          postType={chatPostType}
          inputRowHeight={inputRowHeight}
          isShowPostDetails={isShowPostDetails}
        />
      </Stack>
      <Measure bounds onResize={(contentRect) => setInputRowHeight(contentRect.bounds.height)}>
        {({ measureRef }) => <ChatDialogInputRow postType={chatPostType} postId={chatPostId} ref={measureRef} />}
      </Measure>
    </>
  );
};

const ChatDialog = ({ isShow }) => {
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
  const { state } = useContext(ChatContext);
  const selectedChatId = getSelectedChatId(state);
  const isNewChat = getIsNewChat(state);
  const postId = getPostId(state);
  const postType = getPostType(state);

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
      <ChatDialogContainer isShow={isShow}>
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
    <ChatDialogContainer isShow={isShow}>
      <ChatDialogContent post={post} chat={chat} setChat={setChat} />
    </ChatDialogContainer>
  );
};

export default ChatDialog;
