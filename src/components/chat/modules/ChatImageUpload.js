import React, { useCallback, useContext } from 'react';
import Gallery from '@kiwicom/orbit-components/lib/icons/Gallery';
import { useDropzone } from 'react-dropzone';
import ChatError from '../../../../utils/api/error/chatError';
import api from '../../../../utils/api';
import { donations } from '../../../../utils/constants/postType';
import { useRouter } from 'next/router';
import ChatContext from './ChatContext';

const ChatImageUpload = ({ postType, postId, setAlertMessage, onCloseAlert }) => {
  const router = useRouter();
  const { selectedChatId, setSelectedChatId, setIsNewChat, isNewChat } = useContext(ChatContext);
  const sendFirstImageMessages = async (images) => {
    const method = postType === donations ? 'sendInitialImageMessagesForDonation' : 'sendInitialImageMessagesForWish';
    const [rawChat, rawFirstMessage] = await api.chats[method](postId, images);
    const chatId = rawChat.data().chatId;
    setIsNewChat(false);
    setSelectedChatId(chatId);
    router.push(`/chat`, `/chat?chatId=${chatId}`, { shallow: true });
  };

  const handleImageUploadError = (err) => {
    if (err instanceof ChatError) {
      setAlertMessage(err.message);
      setTimeout(() => {
        onCloseAlert(); // hide alert message after 5 seconds
      }, 5000);
    }
  };

  const handleImageExceedSizeLimitError = (message) => {
    setAlertMessage(message);
    setTimeout(() => {
      onCloseAlert(); // hide alert message after 5 seconds
    }, 5000);
  };

  const onUpload = useCallback((uploadedFiles, isNewChat, selectedChatId) => {
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
        .then(() => {
          uploadedFiles = [];
        })
        .catch((err) => handleImageUploadError(err));
    } else {
      api.chats.sendImageMessages(selectedChatId, uploadedFiles).catch((err) => handleImageUploadError(err));
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (files) => onUpload(files, isNewChat, selectedChatId),
    accept: '.jpeg, .png, .jpg',
  });
  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <Gallery size="normal" />
    </div>
  );
};

export default ChatImageUpload;
