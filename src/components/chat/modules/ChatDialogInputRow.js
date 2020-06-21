import React, { useState, useEffect, useCallback } from 'react';
import { Button, Stack, InputField } from '@kiwicom/orbit-components/lib';
import ChatButton from '../../../components/buttons/ChatButton';
import api from '../../../../utils/api';
import styled, { css } from 'styled-components';
import Gallery from '@kiwicom/orbit-components/lib/icons/Gallery';
import { useDropzone } from 'react-dropzone';
import { donations, wishes } from '../../../../utils/constants/postType';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';

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

const ImageUpload = ({ selectedChatId, setSelectedChatId, setIsNewChat, isNewChat }) => {
  const onUpload = useCallback((uploadedFiles) => {
    if (isNewChat) {
      sendFirstImageMessages(uploadedFiles)
        .then((chat) => {
          setSelectedChatId(chat.data().chatId);
          setIsNewChat(false);
          uploadedFiles = [];
        })
        .catch((err) => console.error(err));
    } else {
      api.chats.sendImageMessages(selectedChatId, uploadedFiles).catch((err) => console.error(err));
    }
  }, []);
  const { getRootProps, getInputProps } = useDropzone({ onDrop: onUpload });
  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <Gallery size="normal" />
    </div>
  );
};

const ChatDialogInputRow = ({ selectedChatId, setSelectedChatId, isNewChat, setIsNewChat, postType, postId }) => {
  /**
   * TODO: handle send message and display in chat
   */

  const [inputMessage, setInputMessage] = useState('');
  const handleSendMessage = () => {
    if (inputMessage.trim().length <= 0) {
      return; // no content being sent if empty or all spaces
    }
    if (isNewChat) {
      sendFirstMessage().then((chat) => {
        // need to get the chat id from the newly created chat to select chat id
        setSelectedChatId(chat.chatId);
        setInputMessage(''); // clear input message after sent
        setIsNewChat(false);
      });
    } else {
      api.chats.sendTextMessage(selectedChatId, inputMessage).then(() => {
        setInputMessage(''); // clear input message after sent
      });
    }
  };

  const sendFirstImageMessages = async (images) => {
    const method = postType === donations ? 'sendInitialImageMessagesForDonation' : 'sendInitialImageMessagesForWish';
    const [rawChat, rawFirstMessage] = await api.chats[method](postId, images);
    return rawChat.data();
  };

  const sendFirstMessage = async () => {
    const method = postType === donations ? 'sendInitialTextMessageForDonation' : 'sendInitialTextMessageForWish';
    const [rawChat, rawFirstMessage] = await api.chats[method](postId, inputMessage);
    return rawChat.data();
  };

  return (
    <InputRowContainer>
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
        />
        <Button size="small" onClick={handleSendMessage} asComponent={ChatButton}>
          Send
        </Button>
      </Stack>
    </InputRowContainer>
  );
};

export default ChatDialogInputRow;
