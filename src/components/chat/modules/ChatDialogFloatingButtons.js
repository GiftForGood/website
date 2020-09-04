import React, { useState, useContext } from 'react';
import { Button, Stack } from '@kiwicom/orbit-components/lib';
import CalendarModal from '../../calendar/modules/CalendarModal';
import SuggestDateButton from '../../../components/buttons/ChatSuggestDatesButton';
import api from '../../../../utils/api';
import styled from 'styled-components';
import { getFormattedDateRange } from '../../../../utils/api/time';
import { donations } from '../../../../utils/constants/postType';
import { useRouter } from 'next/router';
import ChatContext from '../context';
import { setSelectedChatId, setIsNewChat } from '../actions';
import { getSelectedChatId, getIsNewChat } from '../selectors';

const ButtonsContainer = styled.div`
  overflow-x: scroll;
`;
const ChatDialogFloatingButtons = ({ postType, postId }) => {
  const { state, dispatch } = useContext(ChatContext);
  const isNewChat = getIsNewChat(state);
  const selectedChatId = getSelectedChatId(state);
  const [showSuggestDateModal, setShowSuggestDateModal] = useState(false);

  const handleShowSuggestDateModal = () => setShowSuggestDateModal(true);
  const handleCloseSuggestDateModal = () => setShowSuggestDateModal(false);

  const router = useRouter();

  const sendFirstCalendarMessage = async (calendarRawString) => {
    const method =
      postType === donations ? 'sendInitialCalendarMessageForDonation' : 'sendInitialCalendarMessageForWish';
    const [rawChat, rawFirstMessage] = await api.chats[method](postId, calendarRawString);
    const chatId = rawChat.data().chatId;
    dispatch(setIsNewChat(false));
    dispatch(setSelectedChatId(chatId));
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
    <ButtonsContainer>
      <Stack direction="row" spacing="tight">
        <Button size="small" onClick={handleShowSuggestDateModal} asComponent={SuggestDateButton}>
          Suggest Dates
        </Button>
        <CalendarModal
          onShow={showSuggestDateModal}
          onHide={handleCloseSuggestDateModal}
          sendCalendarMessage={handleSendCalendarMessage}
        />
      </Stack>
    </ButtonsContainer>
  );
};

export default ChatDialogFloatingButtons;
