import React, { useState, useEffect } from 'react';
import Calendar from './Calendar';
import styled from 'styled-components';
import { colors } from '../../../../utils/constants/colors';
import { Button, Heading, Stack } from '@kiwicom/orbit-components/lib';
import { getFormattedDateRange } from '../../../../utils/api/time';
import Modal, { ModalSection, ModalFooter } from '@kiwicom/orbit-components/lib/Modal';

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

const CalendarModal = ({ onShow, onHide }) => {
  const [selectedDates, setSelectedDates] = useState([]);
  if (!onShow) {
    return <div></div>;
  }
  const onClickOk = () => {
    console.log(selectedDates);
    if (selectedDates.length > 0) {
      const message = selectedDates
        .map((selectedDate) => getFormattedDateRange(selectedDate.startDate, selectedDate.endDate))
        .join(','); // dates are separated by comma
      const messageType = 'calendar';
      // TODO: call chat api that creates a new message of type calendar
    }
    onHide();
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
