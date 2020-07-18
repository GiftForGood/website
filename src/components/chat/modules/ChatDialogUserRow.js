import React, { useState, useEffect } from 'react';
import { Button, Stack } from '@kiwicom/orbit-components/lib';
import CalendarModal from '../../calendar/modules/CalendarModal';
import AppreciationMessageModal from '../../modal/AppreciationMessageModal';
import ConfirmCompletionModal from '../../modal/ConfirmCompletionModal';
import ProfileAvatar from '../../imageContainers/ProfileAvatar';
import BlackText from '../../text/BlackText';
import RatingStars from '../../ratingStars';
import SuggestDateButton from '../../../components/buttons/ChatSuggestDatesButton';
import CompleteButton from '../../../components/buttons/ChatCompleteButton';
import styled from 'styled-components';
import { colors } from '../../../../utils/constants/colors';
import { CardSection } from '@kiwicom/orbit-components/lib/Card';
import { PENDING, COMPLETED } from '../../../../utils/constants/postStatus';
import StatusTag from '../../../components/tags/StatusTag';
import { donations } from '../../../../utils/constants/postType';
import { useRouter } from 'next/router';
import api from '../../../../utils/api';
import { getFormattedDateRange } from '../../../../utils/api/time';

const AvatarContainer = styled.div`
  float: left;
  width: fit-content;
`;

const ButtonsContainer = styled.div`
  width: fit-content;
`;

/**
 *
 * @param {string} name is the name of the opposite user
 * @param {string} profileImageUrl is the url of the opposite user's profile image
 * @param {string} rating is the rating of the opposite user
 */
const ChatDialogUserRow = ({
  postId,
  postType,
  postStatus,
  loggedInUser,
  selectedChatId,
  setSelectedChatId,
  setHasError,
  isNewChat,
  setIsNewChat,
  oppositeUser,
  postOwnerId,
  postEnquirerId,
  rating,
}) => {
  const [showSuggestDateModal, setShowSuggestDateModal] = useState(false);
  const [showAppreciationMessageModal, setShowAppreciationMessageModal] = useState(false);
  const [showConfirmCompletionModal, setShowConfirmCompletionModal] = useState(false);
  const [status, setStatus] = useState(postStatus);
  const router = useRouter();

  const handleCloseAppreciationMessageModal = () => setShowAppreciationMessageModal(false);
  const handleShowAppreciationMessageModal = () => setShowAppreciationMessageModal(true);
  const handleCloseConfirmCompletionModal = () => setShowConfirmCompletionModal(false);
  const handleSetStatusToComplete = () => setStatus(COMPLETED);
  const handleShowSuggestDateModal = () => setShowSuggestDateModal(true);
  const handleCloseSuggestDateModal = () => setShowSuggestDateModal(false);
  const isLoggedInUserThePostOwner = loggedInUser.user.userId === postOwnerId;

  const handleCompletePost = () => {
    setShowConfirmCompletionModal(true);
  };

  // set status state based on the changes in passed input parameter postStatus
  useEffect(() => {
    setStatus(postStatus);
  }, [postStatus]);

  const handleSendCalendarMessage = (selectedDates) => {
    if (selectedDates.length > 0) {
      const message = selectedDates
        .map((selectedDate) => getFormattedDateRange(selectedDate.startDate, selectedDate.endDate))
        .join(','); // dates are separated by comma
      if (isNewChat) {
        sendFirstCalendarMessage(message)
          .then((chat) => {
            // need to get the chat id from the newly created chat to select chat id
            setSelectedChatId(chat.chatId);
            setIsNewChat(false);
          })
          .catch((err) => console.error(err));
      } else {
        api.chats.sendCalendarMessage(selectedChatId, message).catch((err) => console.error(err));
      }
    }
    handleCloseSuggestDateModal();
  };

  const sendFirstCalendarMessage = async (calendarRawString) => {
    const method =
      postType === donations ? 'sendInitialCalendarMessageForDonation' : 'sendInitialCalendarMessageForWish';
    const [rawChat, rawFirstMessage] = await api.chats[method](postId, calendarRawString);
    router.push(`/chat/${rawChat.data().chatId}`);
    return rawChat.data();
  };

  return (
    <CardSection>
      <Stack direction="row" justify="between" align="center">
        <AvatarContainer>
          <Stack direction="row" align="center">
            <ProfileAvatar imageUrl={oppositeUser.profileImageUrl.small || oppositeUser.profileImageUrl.raw} />
            <Stack direction="column" align="start" spacing="extraTight">
              <BlackText size="small">{oppositeUser.name || oppositeUser.userName}</BlackText>
              <RatingStars rating={rating} showEmpty color={colors.ratingStarBackground} size="small" />
            </Stack>
          </Stack>
        </AvatarContainer>
        <ButtonsContainer>
          <Stack tablet={{ direction: 'row', spacing: 'condensed' }} direction="column" spacing="tight" align="end">
            <Button size="small" onClick={handleShowSuggestDateModal} asComponent={SuggestDateButton}>
              Suggest Dates
            </Button>
            <CalendarModal
              onShow={showSuggestDateModal}
              onHide={handleCloseSuggestDateModal}
              sendCalendarMessage={handleSendCalendarMessage}
            />
            {status === PENDING ? (
              <Button
                size="small"
                onClick={handleCompletePost}
                asComponent={CompleteButton}
                disabled={!isLoggedInUserThePostOwner}
              >
                Complete
              </Button>
            ) : (
              <StatusTag postStatus={status} />
            )}
            <AppreciationMessageModal
              postType={postType}
              postId={postId}
              oppositeUserName={oppositeUser.name || oppositeUser.userName}
              selectedChatId={selectedChatId}
              setSelectedChatId={setSelectedChatId}
              isNewChat={isNewChat}
              setIsNewChat={setIsNewChat}
              onShow={showAppreciationMessageModal}
              onHide={handleCloseAppreciationMessageModal}
            />
            <ConfirmCompletionModal
              postType={postType}
              postId={postId}
              postEnquirerId={postEnquirerId}
              onShow={showConfirmCompletionModal}
              onClose={handleCloseConfirmCompletionModal}
              setHasError={setHasError}
              setCompletedStatus={handleSetStatusToComplete}
              setShowAppreciationMessageModal={handleShowAppreciationMessageModal}
            />
          </Stack>
        </ButtonsContainer>
      </Stack>
    </CardSection>
  );
};

export default ChatDialogUserRow;
