import React, { useState, useEffect } from 'react';
import { Stack, ButtonLink } from '@kiwicom/orbit-components/lib';
import ChatDialogUserRow from './ChatDialogUserRow';
import ChatDialogViewPostRow from './ChatDialogViewPostRow';
import ChatDialogMessages from './ChatDialogMessages';
import ChatDialogInputRow from './ChatDialogInputRow';
import BlackText from '../../text/BlackText';
import api from '../../../../utils/api';
import styled from 'styled-components';
import ChevronLeft from '@kiwicom/orbit-components/lib/icons/ChevronLeft';
import useMediaQuery from '@kiwicom/orbit-components/lib/hooks/useMediaQuery';

const ChatDialogContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const MessageContainer = styled.div`
  width: fit-content;
  margin: 0 auto;
  margin-top: 40vh;
`;

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

const ChatDialogMobile = ({ chatMessages, navBarHeight, setSelectedChatId }) => {
  return (
    <>
      <Stack direction="column" spacing="none">
        <ButtonLink
          onClick={function () {
            setSelectedChatId(null);
          }}
          iconLeft={<ChevronLeft />}
          transparent
          type="secondary"
        />
        <ChatDialogUserRow
          rating={dummyUser.rating}
          name={dummyUser.name}
          profileImageUrl={dummyUser.profileImageUrl}
        />
        <ChatDialogViewPostRow postType="wishes" postId={123} postTitle="Bicycle for 1 child" />
        <ChatDialogMessages messages={chatMessages} navBarHeight={navBarHeight} />
      </Stack>
      <ChatDialogInputRow />
    </>
  );
};

const ChatDialogDesktop = ({ chatMessages, navBarHeight }) => {
  return (
    <>
      <Stack direction="column" spacing="none">
        <ChatDialogUserRow
          rating={dummyUser.rating}
          name={dummyUser.name}
          profileImageUrl={dummyUser.profileImageUrl}
        />
        <ChatDialogViewPostRow postType="wishes" postId={123} postTitle="Bicycle for 1 child" />
        <ChatDialogMessages messages={chatMessages} navBarHeight={navBarHeight} />
      </Stack>
      <ChatDialogInputRow />
    </>
  );
};

const ChatDialog = ({ selectedChatId, setSelectedChatId, navBarHeight }) => {
  const { isTablet } = useMediaQuery();
  const [chatMessages, setChatMessages] = useState([]);
  useEffect(() => {
    /**
     * TODO: load the corresponding chat messages according to the selectedChatId
     */
    if (selectedChatId != null) {
      setChatMessages(listOfChatMessages);
    }
  }, [selectedChatId]);

  // no chat selected yet
  if (selectedChatId == null) {
    return (
      <ChatDialogContainer>
        <MessageContainer>
          <BlackText>Select a chat to view the messages.</BlackText>
        </MessageContainer>
      </ChatDialogContainer>
    );
  }

  return (
    <ChatDialogContainer>
      {isTablet ? (
        <ChatDialogDesktop chatMessages={chatMessages} navBarHeight={navBarHeight} />
      ) : (
        <ChatDialogMobile
          chatMessages={chatMessages}
          navBarHeight={navBarHeight}
          setSelectedChatId={setSelectedChatId}
        />
      )}
    </ChatDialogContainer>
  );
};

export default ChatDialog;
