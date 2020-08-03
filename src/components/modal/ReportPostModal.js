import React, { useState } from 'react';
import RedButton from '../buttons/RedButton';
import api from '../../../utils/api';
import { reportPostReasons } from '../../../utils/constants/reportPostReasons';
import { Button, ChoiceGroup, Stack, Radio, Textarea } from '@kiwicom/orbit-components/lib';
import Modal, { ModalSection } from '@kiwicom/orbit-components/lib/Modal';
import { wishes } from '../../../utils/constants/postType';

const ReportPostModal = ({ postId, postType, loginUserId, onClose }) => {
  const OTHERS = reportPostReasons[reportPostReasons.length - 1];

  const [reason, setReason] = useState(reportPostReasons[0]); // set reason for radio button
  const [otherReason, setOtherReason] = useState(''); // set other reason for text area

  const postToFirestore = async (reportPostReason) => {
    try {
      if (postType === wishes) {
        const reportDoc = await api.reports.reportWish(postId, loginUserId, reportPostReason);
      } else {
        const reportDoc = await api.reports.reportDonation(postId, loginUserId, reportPostReason);
      }
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
    return reportPostReasons.map((reportPostReason, index) => {
      return (
        <Radio
          key={index}
          label={reportPostReason}
          value={reportPostReason}
          checked={reason === reportPostReason}
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
          <ChoiceGroup label="Why are you reporting this post?">
            <Reasons />
          </ChoiceGroup>
          <Textarea
            placeholder="If selected 'Others', please specify the reason for reporting this post."
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
            Report
          </Button>
        </Stack>
      </ModalSection>
    </Modal>
  );
};

export default ReportPostModal;
