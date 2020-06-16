import React from 'react';
import styled, { css } from 'styled-components';
import { colors } from '../../../../utils/constants/colors';
import { Stack } from '@kiwicom/orbit-components/lib';
import CalendarButton from '../../buttons/CalendarButton';

const ChatBubbleContainer = styled.div`
  max-width: 60%;
  width: fit-content;
  padding: 5px 15px 5px 15px;
  border-radius: 5px;
  background-color: ${(props) =>
    props.isByLoggedInUser ? colors.myChatBubbleBackground : colors.oppositeChatBubbleBackground};
`;

/**
 *
 * @param {string[]} dateTimes are the date time selections to show to the user
 * @param {boolean} isByLoggedInUser is whether the image is sent by logged in user
 */
const ChatBubbleForCalendar = ({ dateTimes, isByLoggedInUser }) => {
  return (
    <Stack direction="column" spacing="condensed">
      <ChatBubbleContainer isByLoggedInUser={isByLoggedInUser}>
        Here are the dates I have selected, please choose 1 that fits your timing
      </ChatBubbleContainer>
      <Stack direction="column" spacing="condensed">
        {dateTimes.map((dateTime, i) => {
          // TODO: implement on click handler when selecting a time slot
          return <CalendarButton dateTime={dateTime} onClickHandler key={i} />;
        })}
      </Stack>
    </Stack>
  );
};

export default ChatBubbleForCalendar;
