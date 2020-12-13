import React, { useState, useEffect } from 'react';
import { Stack, Button, ListChoice } from '@kiwicom/orbit-components/lib';
import Modal, { ModalSection, ModalHeader, ModalFooter } from '@kiwicom/orbit-components/lib/Modal';
import { deserializeFirestoreTimestampToUnixTimestamp } from '@utils/firebase/deserializer';
import api from '@api';
import { getFormattedDate } from '@api/time';
import { ORGANIZATION_ACTIONS } from '@constants/npoOrganization';

const HistoryModal = ({ organization, onClose }) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    api.npoOrganization.getEditHistory(organization.id).then((history) => {
      setHistory([...history]);
    });
  }, []);

  return (
    <Modal size="small" onClose={onClose} fixedFooter>
      <ModalHeader title="Edit history" />
      <ModalSection>
        <Stack spacing="compact" spaceAfter="largest">
          {history.map((item, index) => {
            const historyItemData = item.data();
            deserializeFirestoreTimestampToUnixTimestamp(historyItemData);
            const { email, type, appliedDateTime } = historyItemData;

            return <HistoryItem key={index} email={email} type={type} dateTime={getFormattedDate(appliedDateTime)} />;
          })}
        </Stack>
      </ModalSection>
      <ModalFooter>
        <Button type="secondary" fullWidth="100%" size="small" onClick={onClose}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const HistoryItem = ({ email, dateTime, type }) => {
  const description = `By: ${email} at ${dateTime}`;
  let title = `Updated organization's`;
  if (type === ORGANIZATION_ACTIONS.UPDATE_DESC) {
    title = `${title} description`;
  } else if (type === ORGANIZATION_ACTIONS.UPDATE_COVER_IMAGE) {
    title = `${title} cover image`;
  } else if (type === ORGANIZATION_ACTIONS.UPDATE_PROFILE_IMAGE) {
    title = `${title} profile image`;
  } else {
    title = `${title} ${type}`;
  }

  return <ListChoice description={description} title={title} />;
};

export default HistoryModal;
