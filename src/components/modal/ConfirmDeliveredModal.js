import React from 'react';
import ChatDeliveredButton from '../buttons/ChatDeliveredButton';
import api from '@api';
import { Button, Stack } from '@kiwicom/orbit-components/lib';
import Modal, { ModalSection, ModalHeader } from '@kiwicom/orbit-components/lib/Modal';
import { useRouter } from 'next/router';

const ConfirmDeliveredModal = ({
  postId,
  selectedChatId,
  setSelectedChatId,
  isNewChat,
  setIsNewChat,
  onShow,
  onClose,
}) => {
  if (!onShow) {
    return null;
  }
  const router = useRouter();
  const deliveredMessage =
    'I have delivered the items to the beneficiary, please confirm and mark the wish as completed!';

  const onConfirm = async () => {
    if (isNewChat) {
      sendFirstMessage(deliveredMessage)
        .then((chat) => {
          setIsNewChat(false);
          setSelectedChatId(chat.chatId);
          router.push(`/chat?chatId=${chat.chatId}`);
        })
        .catch((err) => console.error(err));
    } else {
      api.chats.sendTextMessage(selectedChatId, deliveredMessage).catch((err) => console.error(err));
    }
    onClose();
  };

  // still need to handle if donor marks as delivered before the first message in chat is sent
  const sendFirstMessage = async () => {
    const [rawChat, rawFirstMessage] = await api.chats.sendInitialTextMessageForWish(postId, deliveredMessage);
    return rawChat.data();
  };

  return (
    <Modal size="small">
      <ModalHeader title="Confirm delivered?" />
      <ModalSection>
        <Stack direction="row">
          <Button type="secondary" fullWidth="100%" onClick={onClose}>
            Cancel
          </Button>
          <Button fullWidth="100%" asComponent={ChatDeliveredButton} onClick={onConfirm}>
            Confirm
          </Button>
        </Stack>
      </ModalSection>
    </Modal>
  );
};

export default ConfirmDeliveredModal;
