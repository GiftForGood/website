import React, { useState, useEffect } from 'react';
import { Stack, Button, ListChoice } from '@kiwicom/orbit-components/lib';
import Modal, { ModalSection, ModalHeader } from '@kiwicom/orbit-components/lib/Modal';
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
    <Modal size="small">
      <ModalHeader title="Edit history" />
      <ModalSection>
        <Stack spacing="compact" spaceAfter="largest">
          {history.map((item) => {
            const historyItemData = item.data();
            deserializeFirestoreTimestampToUnixTimestamp(historyItemData);
            const { email, type, appliedDateTime } = historyItemData;

            return <HistoryItem email={email} type={type} dateTime={getFormattedDate(appliedDateTime)} />;
          })}
        </Stack>
        <Stack direction="row">
          <Button type="secondary" fullWidth="100%" size="small" onClick={onClose}>
            Close
          </Button>
        </Stack>
      </ModalSection>
    </Modal>
  );
};

const HistoryItem = ({ email, dateTime, type }) => {
  if (type === ORGANIZATION_ACTIONS.UPDATE_DESC) {
    return <ListChoice description={`By: ${email} at ${dateTime}`} title={`Updated organization's description`} />;
  } else if (type === ORGANIZATION_ACTIONS.UPDATE_COVER_IMAGE) {
    return <ListChoice description={`By: ${email} at ${dateTime}`} title={`Updated organization's cover image`} />;
  } else if (type === ORGANIZATION_ACTIONS.UPDATE_PROFILE_IMAGE) {
    return <ListChoice description={`By: ${email} at ${dateTime}`} title={`Updated organization's profile image`} />;
  } else {
    return <ListChoice description={`By: ${email} at ${dateTime}`} title={type} />;
  }
};

export default HistoryModal;
