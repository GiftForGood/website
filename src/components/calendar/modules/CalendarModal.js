import React from 'react';
import Calendar from './Calendar';
import styled from 'styled-components';
import { Button, Heading, Stack } from '@kiwicom/orbit-components/lib';
import Modal, { ModalSection, ModalFooter } from '@kiwicom/orbit-components/lib/Modal';

const okButton = styled.button`
  background: #4db6ac;

  :hover {
    background: #35ada0;
  }

  :focus {
    box-shadow: 0 0 0 3px #16a595;
  }
`;

const DATE = '5';
const title = 'Suggest Dates to deliver';
const description = '*Please select up to ' + DATE + ' dates';

const CalendarModal = ({ ...props }) => {
  if (!props.onShow) {
    return <div></div>;
  }

  return (
    <Modal size="large" isMobileFullPage="true">
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
        <Stack direction="row" justify="end">
          <Button type="secondary" onClick={props.onHide}>
            Cancel
          </Button>
          <Button onClick={props.onHide} asComponent={okButton}>
            Ok
          </Button>
        </Stack>
      </ModalFooter>
    </Modal>
  );
};

export default CalendarModal;
