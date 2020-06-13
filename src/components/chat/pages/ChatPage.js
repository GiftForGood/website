import React, { useState } from 'react';
import { Grid, Stack } from '@kiwicom/orbit-components/lib';
import ListOfChats from '../modules/ListOfChats';
import ChatDialog from '../modules/ChatDialog';
import api from '../../../../utils/api';
import styled, { css } from 'styled-components';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';
import { EMAIL_BAR_HEIGHT, NAVBAR_HEIGHT } from '../../../../utils/constants/navbar';
import useMediaQuery from '@kiwicom/orbit-components/lib/hooks/useMediaQuery';

const ChatPageContainer = styled.div`
  max-height: 80vh;
`;

const ChatPage = ({ user }) => {
  const { isTablet } = useMediaQuery();
  const navBarOffsetHeight = user
    ? NAVBAR_HEIGHT.DESKTOP
    : user.emailVerified
    ? NAVBAR_HEIGHT.DESKTOP
    : NAVBAR_HEIGHT.DESKTOP + EMAIL_BAR_HEIGHT.DESKTOP;

  const gridContainerStyle = {
    height: `calc(100vh - ${navBarOffsetHeight}px)`,
    width: '100vw',
  };

  const ChatPageTabletAndDesktop = () => {
    return (
      <Grid style={gridContainerStyle} columns="1fr 3fr" rows="1fr">
        <ListOfChats />
        <ChatDialog />
      </Grid>
    );
  };

  const ChatPageMobile = () => {
    return (
      <Grid style={gridContainerStyle} columns="1fr">
        <ListOfChats />
      </Grid>
    );
  };

  return <ChatPageContainer>{isTablet ? <ChatPageTabletAndDesktop /> : <ChatPageMobile />}</ChatPageContainer>;
};

export default ChatPage;
