import React, { useState } from 'react';
import { Button } from '@kiwicom/orbit-components/lib';
import CalendarModal from '../../calendar/modules/CalendarModal';
import SuggestDateButton from '../../../components/buttons/ChatSuggestDatesButton';
import api from '../../../../utils/api';
import styled from 'styled-components';
import { getFormattedDateRange } from '../../../../utils/api/time';
import { donations } from '../../../../utils/constants/postType';
import { useRouter } from 'next/router';

const FloatingButtonsContainer = styled.div`
  position: relative;
`;

const SuggestDateContainer = styled.div`
  float: left;
`;

const ChatDialogFloatingButtons = ({
  postType,
  postId,
  isNewChat,
  setIsNewChat,
  selectedChatId,
  setSelectedChatId,
}) => {
  const [showSuggestDateModal, setShowSuggestDateModal] = useState(false);

  const handleShowSuggestDateModal = () => setShowSuggestDateModal(true);
  const handleCloseSuggestDateModal = () => setShowSuggestDateModal(false);

  const router = useRouter();

  const sendFirstCalendarMessage = async (calendarRawString) => {
    const method =
      postType === donations ? 'sendInitialCalendarMessageForDonation' : 'sendInitialCalendarMessageForWish';
    const [rawChat, rawFirstMessage] = await api.chats[method](postId, calendarRawString);
    const chatId = rawChat.data().chatId;
    setIsNewChat(false);
    setSelectedChatId(chatId);
    router.push(`/chat`, `/chat?chatId=${chatId}`, { shallow: true });
  };

  const handleSendCalendarMessage = (selectedDates) => {
    if (selectedDates.length > 0) {
      const message = selectedDates
        .map((selectedDate) => getFormattedDateRange(selectedDate.startDate, selectedDate.endDate))
        .join(','); // dates are separated by comma
      if (isNewChat) {
        sendFirstCalendarMessage(message)
          .then(() => {})
          .catch((err) => console.error(err));
      } else {
        api.chats.sendCalendarMessage(selectedChatId, message).catch((err) => console.error(err));
      }
    }
    handleCloseSuggestDateModal();
  };

  return (
    <FloatingButtonsContainer>
      <SuggestDateContainer>
        <Button size="small" onClick={handleShowSuggestDateModal} asComponent={SuggestDateButton}>
          Suggest Dates
        </Button>
        <CalendarModal
          onShow={showSuggestDateModal}
          onHide={handleCloseSuggestDateModal}
          sendCalendarMessage={handleSendCalendarMessage}
        />
      </SuggestDateContainer>
    </FloatingButtonsContainer>
  );
};

export default ChatDialogFloatingButtons;
