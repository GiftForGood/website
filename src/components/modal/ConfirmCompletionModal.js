import React from 'react';
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
  setHasError,
  setCompletedStatus,
  setShowAppreciationMessageModal,
}) => {
  if (!onShow) {
    return null;
  }

  const onConfirm = () => {
    api[postType]
      .complete(postId, postEnquirerId)
      .then(() => {
        setCompletedStatus();
        onClose();
        setShowAppreciationMessageModal(); // show appreciation message modal after completing post
      })
      .catch(() => {
        // occurs when completing has error: post does not exist etc
        setHasError(true);
      });
  };

  return (
    <Modal size="small">
      <ModalHeader
        title="Confirm completion of post?"
        description="Completing a post means that your post has been fulfilled."
      />
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
