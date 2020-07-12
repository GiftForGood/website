import React, { useState } from 'react';
import ChatCompleteButton from '../buttons/ChatCompleteButton';
import api from '../../../utils/api';
import { Button, Stack } from '@kiwicom/orbit-components/lib';
import Modal, { ModalSection, ModalHeader } from '@kiwicom/orbit-components/lib/Modal';

const ConfirmCompletionModal = ({
  postId,
  postType,
  postEnquirerId,
  onShow,
  onClose,
  setCompletedStatus,
  setShowAppreciationMessageModal,
}) => {
  if (!onShow) {
    return null;
  }

  const onConfirm = () => {
    api[postType].complete(postId, postEnquirerId).then(() => {
      console.log('Complete post successful.');
      setCompletedStatus();
      onClose();
      setShowAppreciationMessageModal(); // show appreciation message modal after completing post
    });
  };

  return (
    <Modal size="small">
      <ModalHeader title="Confirm completion of post?" description="This action is irreversible!" />
      <ModalSection>
        <Stack direction="row">
          <Button type="secondary" fullWidth="100%" onClick={onClose}>
            Cancel
          </Button>
          <Button fullWidth="100%" asComponent={ChatCompleteButton} onClick={onConfirm}>
            Confirm
          </Button>
        </Stack>
      </ModalSection>
    </Modal>
  );
};

export default ConfirmCompletionModal;
