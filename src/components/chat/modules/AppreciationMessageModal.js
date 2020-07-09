import React, { useState } from 'react';
import styled from 'styled-components';
import { colors } from '../../../../utils/constants/colors';
import { Button, Heading, Stack, Textarea } from '@kiwicom/orbit-components/lib';
import Modal, { ModalSection, ModalFooter } from '@kiwicom/orbit-components/lib/Modal';
import { donations } from '../../../../utils/constants/postType';
import { useRouter } from 'next/router';
import api from '../../../../utils/api';

const submitButton = styled.button`
  background: ${colors.appreciationSelectedBackground};

  width: 80px;

  :hover {
    background: ${colors.appreciationSelectedHoverActive};
  }

  :focus {
    box-shadow: 0 0 0 3px ${colors.appreciationSelectedFocus};
  }
`;

const title = 'Thank you.';
const description = 'Write a thank you message. This will be automatically sent to the donor.';

const AppreciationMessageModal = ({
  postType,
  postId,
  oppositeUserName,
  selectedChatId,
  setSelectedChatId,
  isNewChat,
  setIsNewChat,
  onShow,
  onHide,
}) => {
  const [message, setMessage] = useState([]);
  const [error, setError] = useState('');
  const router = useRouter();
  if (!onShow) {
    return <div></div>;
  }
  const onClickSubmit = () => {
    if (message.length > 0) {
      setError('');
      if (isNewChat) {
        sendFirstMessage(message)
          .then((chat) => {
            // need to get the chat id from the newly created chat to select chat id
            setSelectedChatId(chat.chatId);
            setIsNewChat(false);
          })
          .catch((err) => console.error(err));
      } else {
        api.chats.sendTextMessage(selectedChatId, message).catch((err) => console.error(err));
      }
      onHide();
    } else {
      setError('Appreciation message must not be empty!');
    }
  };

  // still need to handle if post owner completes before the first message in chat is sent
  const sendFirstMessage = async (calendarRawString) => {
    const method = postType === donations ? 'sendInitialTextMessageForDonation' : 'sendInitialTextMessageForWish';
    const [rawChat, rawFirstMessage] = await api.chats[method](postId, calendarRawString);
    router.push(`/chat/${rawChat.data().chatId}`);
    return rawChat.data();
  };

  const wishPlaceholder = `Dear ${oppositeUserName}, thank you for your donation! The beneficiary really love the item and they are grateful for the item.`;
  const donationPlaceholder = `Dear ${oppositeUserName}, thank you!`;

  return (
    <Modal size="normal">
      <ModalSection>
        <Stack spacing="condensed" spaceAfter="normal">
          <Heading type="title2">{title}</Heading>
          <Heading type="title3">{description}</Heading>
        </Stack>
        <Textarea
          value={message}
          rows={6}
          spaceAfter="small"
          onChange={(e) => setMessage(e.target.value)}
          resize="none"
          error={error}
          placeholder={postType === donations ? donationPlaceholder : wishPlaceholder}
        />
      </ModalSection>
      <ModalFooter>
        <Stack direction="row" justify="end" align="center">
          <Button type="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button onClick={onClickSubmit} asComponent={submitButton}>
            Submit
          </Button>
        </Stack>
      </ModalFooter>
    </Modal>
  );
};

export default AppreciationMessageModal;
