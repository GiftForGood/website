import React, { useState, useEffect } from 'react';
import { Button, Text, Grid, Stack, Separator } from '@kiwicom/orbit-components/lib';
import CalendarModal from '../../calendar/modules/CalendarModal';
import ChatDialogUserRow from './ChatDialogUserRow';
import ChatDialogViewPostRow from './ChatDialogViewPostRow';
import ChatDialogMessages from './ChatDialogMessages';
import ChatDialogInputRow from './ChatDialogInputRow';
import api from '../../../../utils/api';
import styled, { css } from 'styled-components';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';

const ChatDialogContainer = styled.div``;

const listOfChatMessages = [
  {
    name: 'Jinz',
    message: 'TOP Hello',
    messageContentType: 'text',
    messageDate: 1591887112440,
    profileImageUrl:
      'https://lh5.googleusercontent.com/-5EqdfAc5juo/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucl1rs-33JOHxPrO29Pe3Vck2sJwkQ/photo.jpg',
    postTitle: 'Barbie dolls',
    isByLoggedInUser: false,
  },
  {
    name: 'James',
    message: 'Hello',
    messageContentType: 'text',
    messageDate: 1591887112438,
    profileImageUrl:
      'https://lh5.googleusercontent.com/-5EqdfAc5juo/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucl1rs-33JOHxPrO29Pe3Vck2sJwkQ/photo.jpg',
    postTitle: 'Barbie dolls',
    isByLoggedInUser: true,
  },
  {
    name: 'Jinz',
    message:
      'Bye, I am just messing around with you. HAHAHA cant believe you fell for it, i am purposely typing very long to test out the sizing of the chat bubble',
    messageContentType: 'text',
    messageDate: 1591887112442,
    profileImageUrl:
      'https://lh5.googleusercontent.com/-5EqdfAc5juo/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucl1rs-33JOHxPrO29Pe3Vck2sJwkQ/photo.jpg',
    postTitle: 'Barbie dolls',
    isByLoggedInUser: false,
  },
  {
    name: 'Jinz',
    message: 'Hello',
    messageContentType: 'text',
    messageDate: 1591887112440,
    profileImageUrl:
      'https://lh5.googleusercontent.com/-5EqdfAc5juo/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucl1rs-33JOHxPrO29Pe3Vck2sJwkQ/photo.jpg',
    postTitle: 'Barbie dolls',
    isByLoggedInUser: false,
  },
  {
    name: 'James',
    message: 'Hello',
    messageContentType: 'text',
    messageDate: 1591887112438,
    profileImageUrl:
      'https://lh5.googleusercontent.com/-5EqdfAc5juo/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucl1rs-33JOHxPrO29Pe3Vck2sJwkQ/photo.jpg',
    postTitle: 'Barbie dolls',
    isByLoggedInUser: true,
  },
  {
    name: 'Jinz',
    message:
      'Bye, I am just messing around with you. HAHAHA cant believe you fell for it, i am purposely typing very long to test out the sizing of the chat bubble',
    messageContentType: 'text',
    messageDate: 1591887112442,
    profileImageUrl:
      'https://lh5.googleusercontent.com/-5EqdfAc5juo/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucl1rs-33JOHxPrO29Pe3Vck2sJwkQ/photo.jpg',
    postTitle: 'Barbie dolls',
    isByLoggedInUser: false,
  },
  {
    name: 'Jinz',
    message: 'Hello',
    messageContentType: 'text',
    messageDate: 1591887112440,
    profileImageUrl:
      'https://lh5.googleusercontent.com/-5EqdfAc5juo/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucl1rs-33JOHxPrO29Pe3Vck2sJwkQ/photo.jpg',
    postTitle: 'Barbie dolls',
    isByLoggedInUser: false,
  },
  {
    name: 'James',
    message: 'Hello',
    messageContentType: 'text',
    messageDate: 1591887112438,
    profileImageUrl:
      'https://lh5.googleusercontent.com/-5EqdfAc5juo/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucl1rs-33JOHxPrO29Pe3Vck2sJwkQ/photo.jpg',
    postTitle: 'Barbie dolls',
    isByLoggedInUser: true,
  },
  {
    name: 'Jinz',
    message:
      'Bye, I am just messing around with you. HAHAHA cant believe you fell for it, i am purposely typing very long to test out the sizing of the chat bubble',
    messageContentType: 'text',
    messageDate: 1591887112442,
    profileImageUrl:
      'https://lh5.googleusercontent.com/-5EqdfAc5juo/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucl1rs-33JOHxPrO29Pe3Vck2sJwkQ/photo.jpg',
    postTitle: 'Barbie dolls',
    isByLoggedInUser: false,
  },
  {
    name: 'Jinz',
    message: 'Hello',
    messageContentType: 'text',
    messageDate: 1591887112440,
    profileImageUrl:
      'https://lh5.googleusercontent.com/-5EqdfAc5juo/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucl1rs-33JOHxPrO29Pe3Vck2sJwkQ/photo.jpg',
    postTitle: 'Barbie dolls',
    isByLoggedInUser: false,
  },
  {
    name: 'James',
    message: 'Hello',
    messageContentType: 'text',
    messageDate: 1591887112438,
    profileImageUrl:
      'https://lh5.googleusercontent.com/-5EqdfAc5juo/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucl1rs-33JOHxPrO29Pe3Vck2sJwkQ/photo.jpg',
    postTitle: 'Barbie dolls',
    isByLoggedInUser: true,
  },
  {
    name: 'Jinz',
    message:
      'BTM. Bye, I am just messing around with you. HAHAHA cant believe you fell for it, i am purposely typing very long to test out the sizing of the chat bubble',
    messageContentType: 'text',
    messageDate: 1591887112442,
    profileImageUrl:
      'https://lh5.googleusercontent.com/-5EqdfAc5juo/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucl1rs-33JOHxPrO29Pe3Vck2sJwkQ/photo.jpg',
    postTitle: 'Barbie dolls',
    isByLoggedInUser: false,
  },
];

const dummyUser = {
  name: 'Jinz',
  profileImageUrl:
    'https://lh5.googleusercontent.com/-5EqdfAc5juo/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucl1rs-33JOHxPrO29Pe3Vck2sJwkQ/photo.jpg',
  rating: 4,
};

const ChatDialog = () => {
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    setChatMessages(listOfChatMessages);
  }, []);

  if (chatMessages.length === 0) {
    return <div>No messages sent yet.</div>;
  }

  return (
    <ChatDialogContainer>
      <Stack direction="column" spacing="none">
        <ChatDialogUserRow
          rating={dummyUser.rating}
          name={dummyUser.name}
          profileImageUrl={dummyUser.profileImageUrl}
        />
        <ChatDialogViewPostRow postType="wishes" postId={123} postTitle="Bicycle for 1 child" />
        <ChatDialogMessages messages={chatMessages} />
      </Stack>
      <ChatDialogInputRow />
    </ChatDialogContainer>
  );
};

export default ChatDialog;
