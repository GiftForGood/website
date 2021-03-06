import React, { useState, useEffect } from 'react';
import { Stack, Tile, NotificationBadge, Badge } from '@kiwicom/orbit-components/lib';
import { useRouter } from 'next/router';
import styled, { css } from 'styled-components';
import ProfileAvatar from '../../components/imageContainers/ProfileAvatar';
import BlackText from '../../components/text/BlackText';
import { getFormattedDate } from '@api/time';
import { IMAGE, CALENDAR } from '@constants/chatContentType';
import { colors } from '@constants/colors';
import { COMPLETED, CLOSED } from '@constants/postStatus';
import { DELIVERED } from '@constants/chatStatus';

const DetailsContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  position: relative;
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
  word-break: break-all;
`;

const NotificationBadgeWrapper = styled.div`
  position: absolute;
  top: 40px;
  right: 0;
`;

const TileContainer = styled.div`
  ${(props) =>
    props.isSelected &&
    css`
      border: 2px solid ${colors.chatCardSelected.background};
    `}
`;

const StatusBadgeContainer = styled.div`
  padding-top: 10px;
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
 * @param {number} unreadCount is the number of unread chat messages for this chat
 * @param {string} lastMessage is the previous last message of this chat
 * @param {string} contentType is the previous last message's content type of this chat
 * @param {string} isSelected is whether the card is being selected
 * @param {function} setSelectedChatId is the handler to execute when click on the user card
 */
const ChatWithUserCard = ({
  chatId,
  profileImageUrl,
  name,
  post,
  chatStatus,
  unreadCount,
  isSelected,
  lastMessage,
  isNewChat,
  setIsNewChat,
  isViewingChatsForMyPost,
  setSelectedChatId,
}) => {
  const router = useRouter();
  const { dateTime, contentType, content } = lastMessage;
  const lastMessageDate = getFormattedDate(dateTime.toMillis());

  const handleClickChat = () => {
    setIsNewChat(false);
    setSelectedChatId(chatId);
    if (isNewChat) {
      // creating a new chat and haven't send the first message
      router.push(`/chat`, `/chat?chatId=${chatId}`, { shallow: true });
    } else if (isViewingChatsForMyPost) {
      router.push(`/chat`, `/chat?chatId=${chatId}&postId=${router.query.postId}&postType=${router.query.postType}`, {
        shallow: true,
      });
    } else {
      const queries = [];
      queries.push(`?chatId=${chatId}`);
      if (router.query.postId) {
        queries.push(`postId=${router.query.postId}`);
      }
      if (router.query.postType) {
        queries.push(`postType=${router.query.postType}`);
      }
      let queryString = queries.join('&');
      const routeWithUpdatedChatId = `/chat${queryString}`;
      router.push(`/chat`, routeWithUpdatedChatId, { shallow: true });
    }
  };

  const StatusBadge = () => {
    if (post.status === COMPLETED || post.status === CLOSED) {
      return <Badge type="neutral">{post.status.toUpperCase()}</Badge>;
    }
    if (chatStatus === DELIVERED) {
      return <Badge type="neutral">{chatStatus.toUpperCase()}</Badge>;
    }
    return null;
  };

  return (
    <TileContainer isSelected={isSelected}>
      <Tile onClick={handleClickChat}>
        <Stack direction="row">
          <AvatarContainer>
            <ProfileAvatar imageUrl={profileImageUrl.small || profileImageUrl.raw} width={30} height={30} />
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
                <OneLineTextContainer style={{ width: '85%' }}>
                  <BlackText size="small" weight="bold">
                    {post.title}
                  </BlackText>
                </OneLineTextContainer>
                <OneLineTextContainer style={{ width: '85%' }}>
                  <BlackText size="small">
                    {contentType === IMAGE ? 'Sent an image' : contentType === CALENDAR ? 'Sent a calendar' : content}
                  </BlackText>
                </OneLineTextContainer>
                <StatusBadgeContainer>
                  <StatusBadge />
                </StatusBadgeContainer>
              </Stack>
            </Stack>
            {unreadCount > 0 && (
              <NotificationBadgeWrapper>
                <NotificationBadge type="info">{unreadCount}</NotificationBadge>
              </NotificationBadgeWrapper>
            )}
          </DetailsContainer>
        </Stack>
      </Tile>
    </TileContainer>
  );
};

export default ChatWithUserCard;
