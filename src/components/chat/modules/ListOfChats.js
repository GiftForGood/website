import React, { useState, useEffect } from 'react';
import { Stack, TileGroup } from '@kiwicom/orbit-components/lib';
import ChatWithUserCard from '../../card/ChatWithUserCard';
import api from '../../../../utils/api';
import styled, { css } from 'styled-components';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';
import { colors } from '../../../../utils/constants/colors';

const ListOfChatsContainer = styled.div`
  min-width: 200px;
  ${media.tablet(css`
    min-width: 300px;
  `)}
  ${media.desktop(css`
    min-width: 350px;
  `)}
  max-height: 100vh;
  overflow-y: scroll;
  border-right: 1px solid ${colors.chatBorders};
`;

const listOfChats = [
  {
    name: 'Jinz',
    lastMessage: 'Bye4',
    lastMessageContentType: 'text',
    lastMessageDate: 1591887112442,
    profileImageUrl:
      'https://lh5.googleusercontent.com/-5EqdfAc5juo/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucl1rs-33JOHxPrO29Pe3Vck2sJwkQ/photo.jpg',
    postTitle: 'Barbie dolls',
  },
  {
    name: 'Jinz',
    lastMessage: 'Bye4',
    lastMessageContentType: 'text',
    lastMessageDate: 1591887112442,
    profileImageUrl:
      'https://lh5.googleusercontent.com/-5EqdfAc5juo/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucl1rs-33JOHxPrO29Pe3Vck2sJwkQ/photo.jpg',
    postTitle: 'Barbie dolls',
  },
  {
    name: 'Jinz',
    lastMessage: 'Bye4',
    lastMessageContentType: 'text',
    lastMessageDate: 1591887112442,
    profileImageUrl:
      'https://lh5.googleusercontent.com/-5EqdfAc5juo/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucl1rs-33JOHxPrO29Pe3Vck2sJwkQ/photo.jpg',
    postTitle: 'Barbie dolls',
  },
  {
    name: 'Jinz',
    lastMessage: 'Bye4',
    lastMessageContentType: 'text',
    lastMessageDate: 1591887112442,
    profileImageUrl:
      'https://lh5.googleusercontent.com/-5EqdfAc5juo/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucl1rs-33JOHxPrO29Pe3Vck2sJwkQ/photo.jpg',
    postTitle: 'Barbie dolls',
  },
  {
    name: 'Jinz',
    lastMessage: 'Bye4',
    lastMessageContentType: 'text',
    lastMessageDate: 1591887112442,
    profileImageUrl:
      'https://lh5.googleusercontent.com/-5EqdfAc5juo/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucl1rs-33JOHxPrO29Pe3Vck2sJwkQ/photo.jpg',
    postTitle: 'Barbie dolls',
  },
  {
    name: 'Jinz',
    lastMessage: 'Bye4',
    lastMessageContentType: 'text',
    lastMessageDate: 1591887112442,
    profileImageUrl:
      'https://lh5.googleusercontent.com/-5EqdfAc5juo/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucl1rs-33JOHxPrO29Pe3Vck2sJwkQ/photo.jpg',
    postTitle: 'Barbie dolls',
  },
  {
    name: 'Jinz',
    lastMessage: 'Bye4',
    lastMessageContentType: 'text',
    lastMessageDate: 1591887112442,
    profileImageUrl:
      'https://lh5.googleusercontent.com/-5EqdfAc5juo/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucl1rs-33JOHxPrO29Pe3Vck2sJwkQ/photo.jpg',
    postTitle: 'Barbie dolls',
  },
  {
    name: 'Jinz',
    lastMessage: 'Bye4',
    lastMessageContentType: 'text',
    lastMessageDate: 1591887112442,
    profileImageUrl:
      'https://lh5.googleusercontent.com/-5EqdfAc5juo/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucl1rs-33JOHxPrO29Pe3Vck2sJwkQ/photo.jpg',
    postTitle: 'Barbie dolls',
  },
  {
    name: 'Jinz',
    lastMessage: 'Bye4',
    lastMessageContentType: 'text',
    lastMessageDate: 1591887112442,
    profileImageUrl:
      'https://lh5.googleusercontent.com/-5EqdfAc5juo/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucl1rs-33JOHxPrO29Pe3Vck2sJwkQ/photo.jpg',
    postTitle: 'Barbie dolls',
  },
  {
    name: 'Jinz',
    lastMessage: 'Bye4',
    lastMessageContentType: 'text',
    lastMessageDate: 1591887112442,
    profileImageUrl:
      'https://lh5.googleusercontent.com/-5EqdfAc5juo/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucl1rs-33JOHxPrO29Pe3Vck2sJwkQ/photo.jpg',
    postTitle: 'Barbie dolls',
  },
];

const ListOfChats = ({ setSelectedChatId }) => {
  const [chats, setChats] = useState([]);

  /**
   * TODO: get list of chats from api
   */
  useEffect(() => {
    setChats(listOfChats);
  }, []);

  return (
    <ListOfChatsContainer>
      <Stack direction="column" spacing="none">
        <TileGroup>
          {chats.map((chat, index) => {
            const { name, lastMessage, profileImageUrl, postTitle, lastMessageDate } = chat;
            return (
              <ChatWithUserCard
                key={index}
                chatId={index} // initial dummy value
                name={name}
                lastMessage={lastMessage}
                profileImageUrl={profileImageUrl}
                postTitle={postTitle}
                lastMessageDateInMs={lastMessageDate}
                setSelectedChatId={setSelectedChatId}
              />
            );
          })}
        </TileGroup>
      </Stack>
    </ListOfChatsContainer>
  );
};

export default ListOfChats;
