import React, { useState, forwardRef } from 'react';
import { Button, Stack, Alert } from '@kiwicom/orbit-components/lib';
import ChatButton from '../../../components/buttons/ChatButton';
import ChatImageUpload from './ChatImageUpload';
import api from '../../../../utils/api';
import styled, { css } from 'styled-components';
import { donations } from '../../../../utils/constants/postType';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';
import TextareaAutosize from 'react-textarea-autosize';
import { useRouter } from 'next/router';

const InputRowContainer = styled.div`
  width: 95%;
  /* for mobile and tablet, the input row will stick to the bottom */
  position: -webkit-sticky; /* Safari */
  position: sticky;
  bottom: 0;
  padding-top: 15px;
  padding-bottom: 15px;
  margin: 0 auto;
  background-color: white;
  ${media.desktop(css`
    position: relative;
    bottom: unset;
  `)}
`;

const AlertWrapper = styled.div`
  position: absolute;
  bottom: 100%;
  width: fit-content;
`;

const StyledTextareaAutosize = styled(TextareaAutosize)`
  width: 100%;
  padding: 10px 10px;
  font-family: 'Trebuchet MS';
  resize: none;

  /* 
     To prevent auto zoom in on iphones, since inputs with font size that are less than 16px will be auto zoomed in.
     Solution taken from: https://thingsthemselves.com/no-input-zoom-in-safari-on-iphone-the-pixel-perfect-way/
   */
  font-size: 16px;
  width: 133.333333333%;
  margin-right: calc(-33.333333333% + 48px) !important;
  transform: scale(0.75);
  transform-origin: left;
`;

const ChatDialogInputRow = ({ selectedChatId, setSelectedChatId, isNewChat, setIsNewChat, postType, postId }, ref) => {
  const [inputMessage, setInputMessage] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const router = useRouter();

  const handleSendTextMessage = () => {
    if (inputMessage.trim().length <= 0) {
      return; // no content being sent if empty or all spaces
    }

    const message = inputMessage.trim(); // remove trailing spaces
    // clear input message before send as opposed to after sending the message, to prevent duplicated messages
    // being sent when spam enter button
    setInputMessage('');
    if (isNewChat) {
      sendFirstMessage(message).then((chat) => {
        // need to get the chat id from the newly created chat to select chat id
        setSelectedChatId(chat.chatId);
        setIsNewChat(false);
      });
    } else {
      api.chats.sendTextMessage(selectedChatId, message).then(() => {});
    }
  };

  const closeAlert = () => {
    setAlertMessage('');
  };

  const sendFirstMessage = async (message) => {
    const method = postType === donations ? 'sendInitialTextMessageForDonation' : 'sendInitialTextMessageForWish';
    const [rawChat, rawFirstMessage] = await api.chats[method](postId, message);
    router.push(`/chat/${rawChat.data().chatId}`);
    return rawChat.data();
  };

  const handleEnterInputter = (event) => {
    // enter pressed, send message (except shift + enter)
    if (event.keyCode == 13) {
      if (!event.shiftKey) {
        event.preventDefault(); // prevent enter from adding a new line in text area
        handleSendTextMessage();
      }
    }
  };

  return (
    <InputRowContainer ref={ref}>
      {alertMessage.length > 0 && (
        <AlertWrapper>
          <Alert icon type="critical" title="Something has gone wrong" closable onClose={closeAlert}>
            {alertMessage}
          </Alert>
        </AlertWrapper>
      )}
      <Stack direction="row" justify="between" align="center">
        <ChatImageUpload
          postType={postType}
          postId={postId}
          selectedChatId={selectedChatId}
          setSelectedChatId={setSelectedChatId}
          setIsNewChat={setIsNewChat}
          setAlertMessage={setAlertMessage}
          onCloseAlert={closeAlert}
          isNewChat={isNewChat}
        />
        <StyledTextareaAutosize
          minRows={1}
          maxRows={5}
          autoFocus={true}
          placeholder="Type your messages here..."
          id="chat-input"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleEnterInputter}
        />
        <Button size="small" onClick={handleSendTextMessage} asComponent={ChatButton}>
          Send
        </Button>
      </Stack>
    </InputRowContainer>
  );
};

export default forwardRef(ChatDialogInputRow);
