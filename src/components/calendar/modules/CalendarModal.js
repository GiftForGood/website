import React from 'react';
import Calendar from './Calendar';
import styled from 'styled-components';
import { colors } from '../../../../utils/constants/colors';
import { Button, Heading, Stack } from '@kiwicom/orbit-components/lib';
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
  if (!onShow) {
    return <div></div>;
  }

  return (
    <Modal size="large">
      <ModalSection>
        <Stack spacing="none" spaceAfter="normal">
          <Heading type="title2">{title}</Heading>
          <Heading type="title5">{description}</Heading>
        </Stack>
        <Stack>
          <Calendar timeslot={{ startTime: 9, endTime: 18, interval: 1 }} maxSlots={DATE} renderDays={{}} />
        </Stack>
      </ModalSection>
      <ModalFooter>
        <Stack direction="row" justify="end" align="center">
          <Button type="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button onClick={onHide} asComponent={okButton}>
            Ok
          </Button>
        </Stack>
      </ModalFooter>
    </Modal>
  );
};

export default CalendarModal;
