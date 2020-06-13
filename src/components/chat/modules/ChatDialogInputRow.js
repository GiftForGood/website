import React, { useState, useEffect } from 'react';
import { ButtonLink, Button, Text, Grid, Stack, InputField } from '@kiwicom/orbit-components/lib';
import ChatButton from '../../../components/buttons/ChatButton';
import api from '../../../../utils/api';
import styled, { css } from 'styled-components';
import Gallery from '@kiwicom/orbit-components/lib/icons/Gallery';

const InputRowContainer = styled.div`
  width: 95%;
  margin: 0 auto;
  margin-top: 15px;
`;

/**
 *
 */
const ChatDialogInputRow = () => {
  const handleSendMessage = () => console.log('see post');
  return (
    <InputRowContainer>
      <Stack direction="row" justify="between" align="center">
        <ButtonLink transparent type="secondary" iconLeft={<Gallery size="large" />} onClick={function () {}} />
        <InputField placeholder="Type your messages here..." />
        <Button size="small" onClick={handleSendMessage} asComponent={ChatButton}>
          Send
        </Button>
      </Stack>
    </InputRowContainer>
  );
};

export default ChatDialogInputRow;
