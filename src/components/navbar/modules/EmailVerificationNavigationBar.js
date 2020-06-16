import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { Text, TextLink, Stack } from '@kiwicom/orbit-components';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';
import { colors } from '../../../../utils/constants/colors';
import useUser from '../../session/modules/useUser';
import AlertCircle from '@kiwicom/orbit-components/lib/icons/AlertCircle';
import { EMAIL_BAR_HEIGHT } from '../../../../utils/constants/navbar';
import api from '../../../../utils/api';

const Container = styled.div`
  display: ${({ shown }) => (shown ? 'flex' : 'none')};
  height: ${EMAIL_BAR_HEIGHT.MOBILE}px;
  background-color: ${colors.donorBackground};
  z-index: 700;
  width: 100%;
  padding-left: 10px;

  ${media.largeMobile(css`
    height: ${EMAIL_BAR_HEIGHT.DESKTOP}px;
  `)};
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
