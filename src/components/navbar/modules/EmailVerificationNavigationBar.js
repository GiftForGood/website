import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { Text, TextLink, Stack } from '@kiwicom/orbit-components';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';
import { colors } from '@constants/colors';
import useUser from '../../session/modules/useUser';
import AlertCircle from '@kiwicom/orbit-components/lib/icons/AlertCircle';
import api from '@api';

const Container = styled.div`
  display: ${({ shown }) => (shown ? 'flex' : 'none')};
  background-color: ${colors.primaryRed.background};
  z-index: 700;
  padding: 10px;
  word-break: break-all;
`;

const EmailVerificationNavigationBar = () => {
  const user = useUser();
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (user) {
      setShown(!user.emailVerified);
    }
  }, [user]);

  const onResendVerificationClick = async () => {
    try {
      await api.auth.sendVerificationEmail();
    } catch (error) {
      console.error(error);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Container shown={shown}>
      <Stack justify="center" align="center" direction="row">
        <AlertCircle size="small" customColor="white" />
        <Text type="white">
          A verification email has been sent to <b>{user.email}</b>.{' '}
          <TextLink type="white" onClick={onResendVerificationClick}>
            Resend verification
          </TextLink>
        </Text>
      </Stack>
    </Container>
  );
};

export default EmailVerificationNavigationBar;
