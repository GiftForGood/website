import React, { useState, useEffect, useCallback } from 'react';
import { Button, Stack, InputField } from '@kiwicom/orbit-components/lib';
import ChatButton from '../../../components/buttons/ChatButton';
import api from '../../../../utils/api';
import styled, { css } from 'styled-components';
import Gallery from '@kiwicom/orbit-components/lib/icons/Gallery';
import { useDropzone } from 'react-dropzone';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';

const InputRowContainer = styled.div`
  width: 95%;
  /* for mobile and tablet, the input row will stick to the bottom */
  position: -webkit-sticky; /* Safari */
  position: sticky;
  bottom: 0;
  padding-top: 15px;
  padding-bottom: 15px;
  margin: 0 auto;
  background-color: white;
  ${media.desktop(css`
    position: relative;
    bottom: unset;
  `)}
`;

const ImageUpload = () => {
  const onUpload = useCallback((uploadedFiles) => {
    /**
     * TODO: upload the image and display in chat
     */
    console.log(uploadedFiles);
  }, []);
  const { getRootProps, getInputProps } = useDropzone({ onDrop: onUpload });
  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <Gallery size="normal" />
    </div>
  );
};

const ChatDialogInputRow = () => {
  /**
   * TODO: handle send message and display in chat
   */
  const handleSendMessage = () => console.log('send message');
  return (
    <InputRowContainer>
      <Stack direction="row" justify="between" align="center">
        <ImageUpload />
        <InputField placeholder="Type your messages here..." />
        <Button size="small" onClick={handleSendMessage} asComponent={ChatButton}>
          Send
        </Button>
      </Stack>
    </InputRowContainer>
  );
};

export default ChatDialogInputRow;
