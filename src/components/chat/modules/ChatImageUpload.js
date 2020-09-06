import React, { useCallback, useContext } from 'react';
import Gallery from '@kiwicom/orbit-components/lib/icons/Gallery';
import { useDropzone } from 'react-dropzone';
import ChatError from '../../../../utils/api/error/chatError';
import api from '../../../../utils/api';
import { donations } from '@constants/postType';
import { MAXIMUM_FILE_SIZE_LIMIT } from '@constants/files';
import { useRouter } from 'next/router';
import ChatContext from '../context';
import { setSelectedChatId, setIsNewChat } from '../actions';
import { getSelectedChatId, getIsNewChat } from '../selectors';

const ChatImageUpload = ({ postType, postId, setAlertMessage, onCloseAlert }) => {
  const router = useRouter();

  const { state, dispatch } = useContext(ChatContext);
  const isNewChat = getIsNewChat(state);
  const selectedChatId = getSelectedChatId(state);

  const sendFirstImageMessages = async (images) => {
    const method = postType === donations ? 'sendInitialImageMessagesForDonation' : 'sendInitialImageMessagesForWish';
    const [rawChat, rawFirstMessage] = await api.chats[method](postId, images);
    const chatId = rawChat.data().chatId;
    dispatch(setIsNewChat(false));
    dispatch(setSelectedChatId(chatId));
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
    if (uploadedFiles.some((file) => file.size > MAXIMUM_FILE_SIZE_LIMIT)) {
      handleImageExceedSizeLimitError('Unable to upload files that are more than 25mb');
      uploadedFiles = uploadedFiles.filter((file) => file.size <= MAXIMUM_FILE_SIZE_LIMIT);
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
