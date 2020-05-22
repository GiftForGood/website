import React, { useCallback, useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { Text, TextLink, Stack } from '@kiwicom/orbit-components';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';
import transition from '@kiwicom/orbit-components/lib/utils/transition';
import { colors } from '../../../../utils/constants/colors';
import useUser from '../../session/modules/useUser';
import AlertCircle from '@kiwicom/orbit-components/lib/icons/AlertCircle';
import { EMAIL_BAR_HEIGHT, NAVBAR_HEIGHT } from '../../../../utils/constants/navbar';
import api from '../../../../utils/api';

const Container = styled.div`
  display: flex;
  height: ${EMAIL_BAR_HEIGHT.MOBILE}px;
  background-color: ${colors.donorBackground};
  position: fixed;
  top: 52px;
  z-index: 700;
  width: 100%;
  padding-left: 10px;
  transition: ${transition(['transform'], 'normal', 'ease-in-out')};
  transform: translate3d(0, ${({ shown }) => (shown ? '0' : `-100px`)}, 0);
  ${media.largeMobile(css`
    top: 64px;
    height: ${EMAIL_BAR_HEIGHT.DESKTOP}px;
    transform: translate3d(0, ${({ shown }) => (shown ? '0' : `-100px`)}, 0);
  `)};
`;

const EmailVerificationNavigationBar = () => {
  const user = useUser();
  const [shown, setShown] = useState(false);
  const [prevScrollPosition, setPrevScrollPosition] = useState(0);

  const handleNavigationBarPosition = useCallback(() => {
    const currentScrollPosition =
      window.scrollY || window.pageYOffset || (document.documentElement && document.documentElement.scrollTop);

    if (prevScrollPosition < currentScrollPosition && currentScrollPosition > NAVBAR_HEIGHT.DESKTOP) {
      setShown(false);
    } else {
      if (user) {
        setShown(!user.emailVerified);
      }
    }

    setPrevScrollPosition(currentScrollPosition);
  }, [prevScrollPosition, setShown]);

  useEffect(() => {
    window.addEventListener('scroll', handleNavigationBarPosition);
    return () => {
      window.removeEventListener('scroll', handleNavigationBarPosition);
    };
  });

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
