import React from 'react';
import Modal, { ModalSection } from '@kiwicom/orbit-components/lib/Modal';
import { ButtonLink, Button, Heading, Stack } from '@kiwicom/orbit-components/lib';
import { useRouter } from 'next/router';
import BlackButton from '../buttons/BlackButton';

const RegisterLoginModal = ({ redirectUrl, onClose }) => {
  const redirectQuery = redirectUrl ? `?redirect=${redirectUrl}` : '';
  const loginHref = `/login${redirectQuery}`;
  const registerHref = `/register${redirectQuery}`;

  const router = useRouter();
  const onLoginClick = () => router.push(loginHref);
  const onRegisterClick = () => router.push(registerHref);
  return (
    <Modal size="small" onClose={onClose}>
      <ModalSection>
        <Stack justify="center" spaceAfter="large">
          <Heading type="title2">Login or Register to Continue</Heading>
        </Stack>
        <Stack align="center" justify="center" direction="column" spacing="loose">
          <Button transparent asComponent={BlackButton} onClick={onLoginClick} fullWidth>
            Login
          </Button>
          <ButtonLink transparent type="secondary" onClick={onRegisterClick} fullWidth>
            Register
          </ButtonLink>
        </Stack>
      </ModalSection>
    </Modal>
  );
};

export default RegisterLoginModal;
