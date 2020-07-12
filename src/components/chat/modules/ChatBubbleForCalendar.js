import React from 'react';
import styled from 'styled-components';
import { colors } from '../../../../utils/constants/colors';
import { Stack } from '@kiwicom/orbit-components/lib';
import WhiteText from '../../text/WhiteText';
import BlackText from '../../text/BlackText';
import CalendarButton from '../../buttons/CalendarButton';
import api from '../../../../utils/api';

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
 * @param {object} sender is the sender that sends this message
 * @param {object} loggedInUser is the currently logged in user
 * @param {number} selectedChatId is the selected chat id
 */
const ChatBubbleForCalendar = ({ dateTimes, isByLoggedInUser, sender, loggedInUser, selectedChatId }) => {
  const text = 'Here are the dates I have selected, please choose 1 that fits your timing';
  return (
    <Stack direction="column" spacing="condensed" align={isByLoggedInUser ? 'end' : 'start'}>
      <ChatTextContainer isByLoggedInUser={isByLoggedInUser}>
        {isByLoggedInUser ? <WhiteText size="small">{text}</WhiteText> : <BlackText size="small">{text}</BlackText>}
      </ChatTextContainer>
      <ChatButtonsContainer>
        <Stack direction="column" spacing="condensed">
          {dateTimes.map((dateTime, i) => {
            const handleClickDateTime = () => {
              // Not sure if need this check as the button is disabled for the owner
              if (sender.id !== loggedInUser.user.userId) {
                // send auto generated message when the user that clicked isn't the one that sent
                const message = `I am available for ${dateTime}`;
                api.chats
                  .sendTextMessage(selectedChatId, message)
                  .then(() => {})
                  .catch((err) => console.error(err));

                // TODO: Add system generated message for delivery partners and promo code
              }
            };
            return (
              <CalendarButton
                dateTime={dateTime}
                onClickHandler={handleClickDateTime}
                isByLoggedInUser={isByLoggedInUser}
                key={i}
              />
            );
          })}
        </Stack>
      </ChatButtonsContainer>
    </Stack>
  );
};

export default ChatBubbleForCalendar;
