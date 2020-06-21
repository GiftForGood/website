import React, { useState, useEffect } from 'react';
import Calendar from './Calendar';
import styled from 'styled-components';
import { colors } from '../../../../utils/constants/colors';
import { Button, Heading, Stack } from '@kiwicom/orbit-components/lib';
import { getFormattedDateRange } from '../../../../utils/api/time';
import Modal, { ModalSection, ModalFooter } from '@kiwicom/orbit-components/lib/Modal';
import { donations } from '../../../../utils/constants/postType';
import api from '../../../../utils/api';

const okButton = styled.button`
  background: ${colors.calendarSelectedBackground};

  width: 80px;

  :hover {
    background: ${colors.calendarSelectedHoverActive};
  }

  :focus {
    box-shadow: 0 0 0 3px ${colors.calendarSelectedFocus};
  }
`;

const DATE = '5';
const title = 'Suggest Dates to deliver';
const description = '*Please select up to ' + DATE + ' dates';

const CalendarModal = ({
  postType,
  postId,
  selectedChatId,
  setSelectedChatId,
  isNewChat,
  setIsNewChat,
  onShow,
  onHide,
}) => {
  const [selectedDates, setSelectedDates] = useState([]);
  if (!onShow) {
    return <div></div>;
  }
  const onClickOk = () => {
    if (selectedDates.length > 0) {
      const message = selectedDates
        .map((selectedDate) => getFormattedDateRange(selectedDate.startDate, selectedDate.endDate))
        .join(','); // dates are separated by comma
      if (isNewChat) {
        sendFirstCalendarMessage(message)
          .then((chat) => {
            // need to get the chat id from the newly created chat to select chat id
            setSelectedChatId(chat.chatId);
            setIsNewChat(false);
          })
          .catch((err) => console.error(err));
      } else {
        api.chats.sendCalendarMessage(selectedChatId, message).catch((err) => console.error(err));
      }
    }
    onHide();
  };

  const sendFirstCalendarMessage = async (calendarRawString) => {
    const method =
      postType === donations ? 'sendInitialCalendarMessageForDonation' : 'sendInitialCalendarMessageForWish';
    const [rawChat, rawFirstMessage] = await api.chats[method](postId, calendarRawString);
    return rawChat.data();
  };

  return (
    <Modal size="large">
      <ModalSection>
        <Stack spacing="none" spaceAfter="normal">
          <Heading type="title2">{title}</Heading>
          <Heading type="title5">{description}</Heading>
        </Stack>
        <Stack>
          <Calendar
            timeslot={{ startTime: 9, endTime: 18, interval: 1 }}
            maxSlots={DATE}
            renderDays={{}}
            updateSelectedDates={setSelectedDates}
          />
        </Stack>
      </ModalSection>
      <ModalFooter>
        <Stack direction="row" justify="end" align="center">
          <Button type="secondary" onClick={onHide}>
            Cancel
          </Button>
          {/* TODO: add handling of creating calendar message in chat */}
          <Button onClick={onClickOk} asComponent={okButton}>
            Ok
          </Button>
        </Stack>
      </ModalFooter>
    </Modal>
  );
};

export default CalendarModal;
