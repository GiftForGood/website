import React, { useState } from 'react';
import Calendar from './Calendar';
import styled from 'styled-components';
import { colors } from '@constants/colors';
import { Button, Heading, Stack } from '@kiwicom/orbit-components/lib';
import Modal, { ModalSection, ModalFooter } from '@kiwicom/orbit-components/lib/Modal';

const okButton = styled.button`
  background: ${colors.primaryTeal.background};

  width: 80px;

  :hover {
    background: ${colors.primaryTeal.hoverActive};
  }

  :focus {
    box-shadow: 0 0 0 3px ${colors.primaryTeal.focus};
  }
`;

const DATE = '5';
const title = 'Suggest Dates to deliver';

const CalendarModal = ({ onShow, onHide, sendCalendarMessage }) => {
  const [selectedDates, setSelectedDates] = useState([]);
  if (!onShow) {
    return <div></div>;
  }
  const onClickOk = () => {
    sendCalendarMessage(selectedDates);
  };

  return (
    <Modal size="large">
      <ModalSection>
        <Stack spaceAfter="normal">
          <Heading type="title2">{title}</Heading>
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
          <Button onClick={onClickOk} asComponent={okButton}>
            Ok
          </Button>
        </Stack>
      </ModalFooter>
    </Modal>
  );
};

export default CalendarModal;
