import React from 'react';
import { Stack, Tile, NotificationBadge } from '@kiwicom/orbit-components/lib';
import { useRouter } from 'next/router';
import styled, { css } from 'styled-components';
import ProfileAvatar from '../../components/imageContainers/ProfileAvatar';
import BlackText from '../../components/text/BlackText';
import { getFormattedDate } from '../../../utils/api/time';
import { IMAGE, CALENDAR } from '../../../utils/constants/chatContentType';
import { colors } from '../../../utils/constants/colors';

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
  bottom: 10px;
  right: 0;
`;

const TileContainer = styled.div`
  ${(props) =>
    props.isSelected &&
    css`
      border: 2px solid ${colors.chatSelected};
    `}
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
  unreadCount,
  lastMessage,
  contentType,
  isSelected,
  isCreatingNewChat,
  isViewingChatsForMyPost,
  setSelectedChatId,
}) => {
  const router = useRouter();
  const lastMessageDate = getFormattedDate(lastMessage.date);
  const handleClickChat = () => {
    if (isCreatingNewChat) {
      // creating a new chat and haven't send the first message
      router.push(`/chat/${chatId}`);
    } else if (isViewingChatsForMyPost) {
      router.push(`/chat/${chatId}?postId=${router.query.postId}&postType=${router.query.postType}`);
    } else {
      const queries = [];
      if (router.query.postId) {
        queries.push(`postId=${router.query.postId}`);
      }
      if (router.query.postType) {
        queries.push(`postType=${router.query.postType}`);
      }
      let queryString = queries.join('&');
      const routeWithUpdatedChatId = `/chat/${chatId}${queryString.length > 0 ? `?${queryString}` : ''}`;
      setSelectedChatId(chatId);

      // use replace instead of push as we do not need to set the highlighting of chat as a new route in history
      router.replace(`/chat/[chatId]`, routeWithUpdatedChatId, { shallow: true });
    }
  };
  return (
    <TileContainer isSelected={isSelected}>
      <Tile onClick={handleClickChat}>
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
                <OneLineTextContainer style={{ width: '85%' }}>
                  <BlackText size="small" weight="bold">
                    {post.title}
                  </BlackText>
                </OneLineTextContainer>
                <OneLineTextContainer style={{ width: '85%' }}>
                  <BlackText size="small">
                    {contentType === IMAGE
                      ? 'Sent an image'
                      : contentType === CALENDAR
                      ? 'Sent a calendar'
                      : lastMessage}
                  </BlackText>
                </OneLineTextContainer>
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
