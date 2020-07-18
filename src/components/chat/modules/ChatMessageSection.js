import React from 'react';
import styled, { css } from 'styled-components';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';
import { Stack } from '@kiwicom/orbit-components/lib';
import ChatBubbleForText from './ChatBubbleForText';
import ChatBubbleForImage from './ChatBubbleForImage';
import ChatBubbleForCalendar from './ChatBubbleForCalendar';
import ProfileAvatar from '../../imageContainers/ProfileAvatar';
import GreyText from '../../text/GreyText';
import { getTimeDifferenceFromNow } from '../../../../utils/api/time';

// to following two containers are used to prevent the
// right section to exceed the maximum width
const RightColumnStackContainer = styled.div`
  width: fit-content;
`;

const RightMessageSectionContainer = styled.div`
  width: fit-content;
  max-width: 90%;
  ${media.tablet(css`
    max-width: 60%;
  `)}
`;

const LeftColumnStackContainer = styled.div`
  width: fit-content;
`;

const LeftMessageSectionContainer = styled.div`
  width: fit-content;
  max-width: 90%;
  ${media.tablet(css`
    max-width: 60%;
  `)}
`;

/**
 * Gets the corresponding chat bubble based on message content type
 */
const getMessageContent = (messageContentType, content, isByLoggedInUser, sender, loggedInUser, selectedChatId) => {
  if (messageContentType === 'text') {
    return <ChatBubbleForText text={content} isByLoggedInUser={isByLoggedInUser} />;
  }
  if (messageContentType === 'image') {
    return <ChatBubbleForImage imageUrl={content} isByLoggedInUser={isByLoggedInUser} />;
  }
  if (messageContentType === 'calendar') {
    const dateTimes = content.split(','); // dateTimes are separated by comma delimiter
    return (
      <ChatBubbleForCalendar
        dateTimes={dateTimes}
        isByLoggedInUser={isByLoggedInUser}
        sender={sender}
        loggedInUser={loggedInUser}
        selectedChatId={selectedChatId}
      />
    );
  }
  // unknown message content type
  return <div>N.A.</div>;
};

export const LeftMessageSection = ({ message, loggedInUser, selectedChatId }) => {
  const { content, sender, dateTime, contentType } = message;
  return (
    <LeftMessageSectionContainer>
      <Stack direction="row" grow={false}>
        <ProfileAvatar imageUrl={sender.profileImageUrl.small || sender.profileImageUrl.raw} width={25} height={25} />
        <LeftColumnStackContainer>
          <Stack direction="column" spacing="extraTight">
            {getMessageContent(contentType, content, false, sender, loggedInUser, selectedChatId)}
            <GreyText size="tiny">{getTimeDifferenceFromNow(dateTime)}</GreyText>
          </Stack>
        </LeftColumnStackContainer>
      </Stack>
    </LeftMessageSectionContainer>
  );
};

export const RightMessageSection = ({ message, loggedInUser, selectedChatId }) => {
  const { content, sender, dateTime, contentType } = message;
  return (
    <Stack direction="column" align="end" spaceAfter="none" grow={false}>
      <RightMessageSectionContainer>
        <Stack direction="row">
          <RightColumnStackContainer>
            <Stack direction="column" spacing="extraTight" align="end">
              {getMessageContent(contentType, content, true, sender, loggedInUser, selectedChatId)}
              <GreyText size="tiny">{getTimeDifferenceFromNow(dateTime)}</GreyText>
            </Stack>
          </RightColumnStackContainer>
          <ProfileAvatar imageUrl={sender.profileImageUrl.small || sender.profileImageUrl.raw} width={25} height={25} />
        </Stack>
      </RightMessageSectionContainer>
    </Stack>
  );
};
