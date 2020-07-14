import React, { useState, useCallback } from 'react';
import { Button, Stack, InputField, Alert } from '@kiwicom/orbit-components/lib';
import ChatButton from '../../../components/buttons/ChatButton';
import api from '../../../../utils/api';
import styled, { css } from 'styled-components';
import Gallery from '@kiwicom/orbit-components/lib/icons/Gallery';
import { useDropzone } from 'react-dropzone';
import { donations } from '../../../../utils/constants/postType';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';
import ChatError from '../../../../utils/api/error/chatError';
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

const ChatDialogInputRow = ({ selectedChatId, setSelectedChatId, isNewChat, setIsNewChat, postType, postId }) => {
  const [inputMessage, setInputMessage] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const router = useRouter();

  const handleSendTextMessage = () => {
    if (inputMessage.trim().length <= 0) {
      return; // no content being sent if empty or all spaces
    }

    const message = inputMessage;
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

  const handleImageUploadError = (err) => {
    if (err instanceof ChatError) {
      setAlertMessage(err.message);
      setTimeout(() => {
        closeAlert(); // hide alert message after 5 seconds
      }, 5000);
    }
  };

  const handleImageExceedSizeLimitError = (message) => {
    setAlertMessage(message);
    setTimeout(() => {
      closeAlert(); // hide alert message after 5 seconds
    }, 5000);
  };

  const closeAlert = () => {
    setAlertMessage('');
  };

  const sendFirstImageMessages = async (images) => {
    const method = postType === donations ? 'sendInitialImageMessagesForDonation' : 'sendInitialImageMessagesForWish';
    const [rawChat, rawFirstMessage] = await api.chats[method](postId, images);
    router.push(`/chat/${rawChat.data().chatId}`);
    return rawChat.data();
  };

  const sendFirstMessage = async (message) => {
    const method = postType === donations ? 'sendInitialTextMessageForDonation' : 'sendInitialTextMessageForWish';
    const [rawChat, rawFirstMessage] = await api.chats[method](postId, message);
    router.push(`/chat/${rawChat.data().chatId}`);
    return rawChat.data();
  };

  const ImageUpload = ({ selectedChatId, setSelectedChatId, setIsNewChat, isNewChat }) => {
    const onUpload = useCallback((uploadedFiles) => {
      // check if file is more than 25 mb
      if (uploadedFiles.some((file) => file.size > 25000000)) {
        handleImageExceedSizeLimitError('Unable to upload files that are more than 25mb');
        uploadedFiles = uploadedFiles.filter((file) => file.size <= 25000000);
      }

      if (uploadedFiles.length === 0) {
        return;
      }

      if (isNewChat) {
        sendFirstImageMessages(uploadedFiles)
          .then((chat) => {
            setSelectedChatId(chat.chatId);
            setIsNewChat(false);
            uploadedFiles = [];
          })
          .catch((err) => handleImageUploadError(err));
      } else {
        api.chats.sendImageMessages(selectedChatId, uploadedFiles).catch((err) => handleImageUploadError(err));
      }
    }, []);

    const { getRootProps, getInputProps } = useDropzone({ onDrop: onUpload, accept: '.jpeg, .png, .jpg' });
    return (
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <Gallery size="normal" />
      </div>
    );
  };

  const handleEnterInputter = (event) => {
    // enter pressed, send message
    if (event.keyCode == 13) {
      handleSendTextMessage();
    }
  };

  return (
    <InputRowContainer>
      {alertMessage.length > 0 && (
        <AlertWrapper>
          <Alert icon type="critical" title="Something has gone wrong" closable onClose={closeAlert}>
            {alertMessage}
          </Alert>
        </AlertWrapper>
      )}
      <Stack direction="row" justify="between" align="center">
        <ImageUpload
          selectedChatId={selectedChatId}
          setSelectedChatId={setSelectedChatId}
          setIsNewChat={setIsNewChat}
          isNewChat={isNewChat}
        />
        <InputField
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

export default ChatDialogInputRow;
