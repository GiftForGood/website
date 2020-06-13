import React, { useState } from 'react';
import { Grid, Stack } from '@kiwicom/orbit-components/lib';
import ListOfChats from '../modules/ListOfChats';
import ChatDialogTabletAndDesktop from '../modules/ChatDialogTabletAndDesktop';
import ChatDialogMobile from '../modules/ChatDialogMobile';
import api from '../../../../utils/api';
import styled, { css } from 'styled-components';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';
import { EMAIL_BAR_HEIGHT, NAVBAR_HEIGHT } from '../../../../utils/constants/navbar';
import useMediaQuery from '@kiwicom/orbit-components/lib/hooks/useMediaQuery';

const ChatPageContainer = styled.div`
  max-height: 80vh;
`;

const ChatPage = ({ user }) => {
  const [selectedChatId, setSelectedChatId] = useState(null);
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
      <Grid style={gridContainerStyle} columns="1fr 3fr">
        <ListOfChats setSelectedChatId={setSelectedChatId} />
        <ChatDialogTabletAndDesktop selectedChatId={selectedChatId} />
      </Grid>
    );
  };

  const ChatPageMobile = () => {
    return (
      <Grid style={gridContainerStyle} columns="1fr">
        {selectedChatId == null ? (
          <ListOfChats setSelectedChatId={setSelectedChatId} />
        ) : (
          <ChatDialogMobile selectedChatId={selectedChatId} setSelectedChatId={setSelectedChatId} />
        )}
      </Grid>
    );
  };

  return <ChatPageContainer>{isTablet ? <ChatPageTabletAndDesktop /> : <ChatPageMobile />}</ChatPageContainer>;
};

export default ChatPage;
