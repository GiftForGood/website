import React, { useState, useEffect } from 'react';
import {
  Button,
  Stack,
  Checkbox,
  Text,
  Modal,
  ModalHeader,
  ModalSection,
  Illustration,
  ModalFooter,
} from '@kiwicom/orbit-components/lib';
import ChevronLeft from '@kiwicom/orbit-components/lib/icons/ChevronLeft';
import api from '../../../../utils/api';

const TermsAndConditionModal = ({ onClose, onSubmit, tnc }) => {
  const [submitButtonEnabled, setSubmitButtonEnabled] = useState(true);
  const [checked, setChecked] = useState(false);

  const handleChecked = (event) => {
    setChecked(event.target.checked);
    if (event.target.checked) {
      setSubmitButtonEnabled(false);
    } else {
      setSubmitButtonEnabled(true);
    }
  };

  const createHTML = () => {
    return { __html: tnc };
  };

  return (
    <>
      <Modal fixedFooter onClose={onClose}>
        <ModalHeader title="Terms and Conditions" illustration={<Illustration name="Insurance" size="extraSmall" />} />
        <ModalSection>
          <Stack>
            <Text as="div">
              <div dangerouslySetInnerHTML={createHTML()} />
            </Text>

            <Checkbox
              checked={checked}
              label={<Text>I agree to the terms and conditions</Text>}
              onChange={handleChecked}
            />
          </Stack>
        </ModalSection>
        <ModalFooter flex={['0 0 auto', '1 1 100%']}>
          <Button iconLeft={<ChevronLeft />} type="secondary" onClick={onClose}>
            Back
          </Button>
          <Button fullWidth onClick={onSubmit} disabled={submitButtonEnabled}>
            Register
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default TermsAndConditionModal;
