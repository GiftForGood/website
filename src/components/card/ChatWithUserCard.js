import React, { useState, useEffect } from 'react';
import { Stack, CardSection, Tile } from '@kiwicom/orbit-components/lib';
import api from '../../../utils/api';
import styled, { css } from 'styled-components';
import ProfileAvatar from '../../components/imageContainers/ProfileAvatar';
import BlackText from '../../components/text/BlackText';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';
import { getFormattedDate } from '../../../utils/api/time';

const DetailsContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

const LastMessageDateContainer = styled.div`
  float: right;
`;

const AvatarContainer = styled.div`
  float: left;
  display: flex;
  width: fit-content;
`;

const AvatarNameContainer = styled.div`
  width: fit-content;
  float: left;
  margin-left: 5px;
  margin-right: auto;
`;

const OneLineTextContainer = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  line-height: 1.5em;
  max-height: 1.5em;
  font-size: 14px;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
`;

const LastMessageDate = ({ date }) => {
  return <BlackText size="small">{date}</BlackText>;
};

const AvatarName = ({ name }) => {
  return (
    <AvatarNameContainer>
      <BlackText size="small">{name}</BlackText>
    </AvatarNameContainer>
  );
};

/**
 * @param {string} chatId is the unique id of the chat
 * @param {string} profileImageUrl is the url of the opposite user's profile image
 * @param {string} name is the opposite user's name
 * @param {string} postTitle is the title of the post that the chat is for
 * @param {string} lastMessage is the previous last message of this chat
 * @param {string} lastMessageDate is the date of the previous last message of this chat in milliseconds
 * @param {function} setSelectedChat is the handler to execute when click on the user card
 */
const ChatWithUserCard = ({
  chatId,
  profileImageUrl,
  name,
  postTitle,
  lastMessage,
  lastMessageDateInMs,
  setSelectedChatId,
}) => {
  const lastMessageDate = getFormattedDate(lastMessageDateInMs);
  return (
    <Tile
      onClick={function () {
        setSelectedChatId(chatId);
      }}
    >
      <Stack direction="row">
        <AvatarContainer>
          <ProfileAvatar imageUrl={profileImageUrl} width={30} height={30} />
        </AvatarContainer>
        <DetailsContainer>
          <Stack direction="column" spacing="compact">
            <Stack direction="row" align="start" justify="between">
              <AvatarName name={name} />
              <LastMessageDateContainer>
                <LastMessageDate date={lastMessageDate} />
              </LastMessageDateContainer>
            </Stack>
            <Stack direction="column" spacing="extraTight">
              <OneLineTextContainer>
                <BlackText size="small" weight="bold">
                  {postTitle}
                </BlackText>
              </OneLineTextContainer>
              <OneLineTextContainer>
                <BlackText size="small">{lastMessage}</BlackText>
              </OneLineTextContainer>
            </Stack>
          </Stack>
        </DetailsContainer>
      </Stack>
    </Tile>
  );
};

export default ChatWithUserCard;
