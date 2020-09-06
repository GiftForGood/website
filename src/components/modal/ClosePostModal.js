import React, { useState } from 'react';
import RedButton from '../buttons/RedButton';
import Alert from '@kiwicom/orbit-components/lib/icons/Alert';
import api from '@api';
import { wishClosePostReasons, donationClosePostReasons } from '@constants/closePostReasons';
import { Button, ChoiceGroup, Heading, Stack, Radio, Text, Textarea } from '@kiwicom/orbit-components/lib';
import Modal, { ModalSection } from '@kiwicom/orbit-components/lib/Modal';
import { wishes } from '@constants/postType';

const ClosePostModal = ({ postId, postType, onClose, setIsClosedPost }) => {
  const isWishPost = postType === wishes;
  const closePostReasons = isWishPost ? wishClosePostReasons : donationClosePostReasons;
  const OTHERS = closePostReasons[closePostReasons.length - 1];

  const [reason, setReason] = useState(closePostReasons[0]); // set reason for radio button
  const [otherReason, setOtherReason] = useState(''); // set other reason for text area

  const postToFirestore = async (closePostReason) => {
    try {
      if (isWishPost) {
        const wishDoc = await api.wishes.close(postId, closePostReason);
      } else {
        const donationDoc = await api.donations.close(postId, closePostReason);
      }
      setIsClosedPost(true);
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmit = () => {
    if (reason !== OTHERS) {
      postToFirestore(reason);
    } else {
      if (otherReason === '') {
        return;
      } else {
        postToFirestore(otherReason);
      }
    }
  };

  const Reasons = () => {
    return closePostReasons.map((closePostReason, index) => {
      return (
        <Radio
          key={index}
          label={closePostReason}
          value={closePostReason}
          checked={reason === closePostReason}
          onChange={(event) => {
            setReason(event.target.value);
          }}
        />
      );
    });
  };

  return (
    <Modal size="small">
      <ModalSection>
        <Stack spacing="compact" spaceAfter="largest">
          <Stack direction="column" spacing="none">
            <Stack direction="row" spacing="tight" align="center">
              <Alert color="warning" />
              <Heading type="title2">WARNING</Heading>
            </Stack>
            <Text spaceAfter="normal">
              Closing a post would mean that you cannot reopen and all the chats related to this post will be closed as
              well.
            </Text>
          </Stack>
          <ChoiceGroup label="What is the reason?">
            <Reasons />
          </ChoiceGroup>
          <Textarea
            placeholder="Reason for closing post"
            rows="4"
            disabled={reason !== OTHERS}
            error={reason === OTHERS && otherReason === '' ? '*required' : null}
            onChange={(event) => {
              setOtherReason(event.target.value);
            }}
          />
        </Stack>
        <Stack direction="row">
          <Button type="secondary" fullWidth="100%" size="small" onClick={onClose}>
            Cancel
          </Button>
          <Button fullWidth="100%" asComponent={RedButton} size="small" onClick={onSubmit}>
            Close
          </Button>
        </Stack>
      </ModalSection>
    </Modal>
  );
};

export default ClosePostModal;
