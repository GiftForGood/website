import React from 'react';
import styled, { css } from 'styled-components';
import { colors } from '../../../../utils/constants/colors';
import { Stack } from '@kiwicom/orbit-components/lib';
import WhiteText from '../../text/WhiteText';
import BlackText from '../../text/BlackText';
import CalendarButton from '../../buttons/CalendarButton';

const ChatTextContainer = styled.div`
  width: fit-content;
  padding: 5px 15px 5px 15px;
  border-radius: 5px;
  background-color: ${(props) =>
    props.isByLoggedInUser ? colors.myChatBubbleBackground : colors.oppositeChatBubbleBackground};
`;

const ChatButtonsContainer = styled.div`
  width: fit-content;
`;

/**
 *
 * @param {string[]} dateTimes are the date time selections to show to the user
 * @param {boolean} isByLoggedInUser is whether the image is sent by logged in user
 */
const ChatBubbleForCalendar = ({ dateTimes, isByLoggedInUser }) => {
  const text = 'Here are the dates I have selected, please choose 1 that fits your timing';
  return (
    <Stack direction="column" spacing="condensed" align={isByLoggedInUser ? 'end' : 'start'}>
      <ChatTextContainer isByLoggedInUser={isByLoggedInUser}>
        {isByLoggedInUser ? <WhiteText size="small">{text}</WhiteText> : <BlackText size="small">{text}</BlackText>}
      </ChatTextContainer>
      <ChatButtonsContainer>
        <Stack direction="column" spacing="condensed">
          {dateTimes.map((dateTime, i) => {
            // TODO: implement on click handler when selecting a time slot
            return <CalendarButton dateTime={dateTime} onClickHandler={function () {}} key={i} />;
          })}
        </Stack>
      </ChatButtonsContainer>
    </Stack>
  );
};

export default ChatBubbleForCalendar;
