import React from 'react';
import styled from 'styled-components';
import { colors } from '@constants/colors';
import { Stack } from '@kiwicom/orbit-components/lib';
import WhiteText from '../../text/WhiteText';
import BlackText from '../../text/BlackText';
import CalendarButton from '../../buttons/CalendarButton';
import api from '@api';

const ChatTextContainer = styled.div`
  width: fit-content;
  padding: 5px 15px 5px 15px;
  border-radius: 5px;
  background-color: ${(props) =>
    props.isByLoggedInUser ? colors.myChatBubble.background : colors.oppositeChatBubble.background};
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
  const handleClickDateTime = (dateTime) => {
    // Not sure if need this check as the button is disabled for the owner
    if (sender.id !== loggedInUser.user.userId) {
      // send auto generated message when the user that clicked isn't the one that sent
      const message = `I am available on ${dateTime}`;
      api.chats
        .sendTextMessage(selectedChatId, message)
        .then(() => {})
        .catch((err) => console.error(err));

      sendSystemGeneratedMessage();
    }
  };

  // system generated message that consists of the delivery partners with their corresponding promo code and url
  const sendSystemGeneratedMessage = () => {
    let logisticPartners;
    api.logistics.getAll().then((res) => {
      logisticPartners = res.docs.map((rawLogisticPartner) => rawLogisticPartner.data());
      // only send system generated message if logistic partners exist
      if (logisticPartners && logisticPartners.length > 0) {
        const partnersMessage = logisticPartners
          .map((partner) => {
            return `${partner.name}: ${partner.url}
Promo Code: ${partner.promoCode ? partner.promoCode : 'Not Required'}`;
          })
          .join('\n\n');

        const systemGeneratedMessage = `---System generated message---

The following are delivery partners of GiftForGood:
${partnersMessage}

More details on our delivery partners: https://www.giftforgood.io/delivery-partners
`;
        api.chats
          .sendTextMessage(selectedChatId, systemGeneratedMessage)
          .then(() => {})
          .catch((err) => console.error(err));
      }
    });
  };
  return (
    <Stack direction="column" spacing="condensed" align={isByLoggedInUser ? 'end' : 'start'}>
      <ChatTextContainer isByLoggedInUser={isByLoggedInUser}>
        {isByLoggedInUser ? <WhiteText size="small">{text}</WhiteText> : <BlackText size="small">{text}</BlackText>}
      </ChatTextContainer>
      <ChatButtonsContainer>
        <Stack direction="column" spacing="condensed">
          {dateTimes.map((dateTime, i) => {
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
