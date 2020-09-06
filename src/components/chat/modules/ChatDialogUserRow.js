import React, { useState, useEffect, useContext } from 'react';
import { Button, Stack } from '@kiwicom/orbit-components/lib';
import CalendarModal from '../../calendar/modules/CalendarModal';
import AppreciationMessageModal from '../../modal/AppreciationMessageModal';
import ConfirmCompletionModal from '../../modal/ConfirmCompletionModal';
import ProfileAvatar from '../../imageContainers/ProfileAvatar';
import BlackText from '../../text/BlackText';
import SuggestDateButton from '../../../components/buttons/ChatSuggestDatesButton';
import CompleteButton from '../../../components/buttons/ChatCompleteButton';
import styled from 'styled-components';
import { colors } from '@constants/colors';
import { CardSection } from '@kiwicom/orbit-components/lib/Card';
import { PENDING, COMPLETED } from '@constants/postStatus';
import StatusTag from '../../../components/tags/StatusTag';
import { donations } from '@constants/postType';
import { useRouter } from 'next/router';
import api from '../../../../utils/api';
import { getFormattedDateRange } from '../../../../utils/api/time';
import ChatContext from '../context';
import { setSelectedChatId, setIsNewChat, setHasError } from '../actions';
import { getSelectedChatId, getIsNewChat, getUser } from '../selectors';

const AvatarContainer = styled.div`
  float: left;
  width: fit-content;
  position: relative;
`;

const ClickableProfile = styled.a`
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 2;
`;

const ButtonsContainer = styled.div`
  width: fit-content;
`;

/**
 *
 * @param {string} name is the name of the opposite user
 * @param {string} profileImageUrl is the url of the opposite user's profile image
 */
const ChatDialogUserRow = ({ postId, postType, postStatus, oppositeUser, postOwnerId, postEnquirerId }) => {
  const [showSuggestDateModal, setShowSuggestDateModal] = useState(false);
  const [showAppreciationMessageModal, setShowAppreciationMessageModal] = useState(false);
  const [showConfirmCompletionModal, setShowConfirmCompletionModal] = useState(false);
  const [status, setStatus] = useState(postStatus);
  const router = useRouter();

  const { state, dispatch } = useContext(ChatContext);
  const loggedInUser = getUser(state);
  const isNewChat = getIsNewChat(state);
  const selectedChatId = getSelectedChatId(state);

  const handleCloseAppreciationMessageModal = () => setShowAppreciationMessageModal(false);
  const handleShowAppreciationMessageModal = () => setShowAppreciationMessageModal(true);
  const handleCloseConfirmCompletionModal = () => setShowConfirmCompletionModal(false);
  const handleSetStatusToComplete = () => setStatus(COMPLETED);
  const handleShowSuggestDateModal = () => setShowSuggestDateModal(true);
  const handleCloseSuggestDateModal = () => setShowSuggestDateModal(false);

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
          .then(() => {})
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
    const chatId = rawChat.data().chatId;
    dispatch(setIsNewChat(false));
    dispatch(setSelectedChatId(chatId));
    router.push(`/chat`, `/chat?chatId=${chatId}`, { shallow: true });
  };

  const profileHref = `/profile/${oppositeUser.id || oppositeUser.userId}`;

  return (
    <CardSection>
      <Stack direction="row" justify="between" align="center">
        <AvatarContainer>
          <Stack direction="row" align="center">
            <ProfileAvatar imageUrl={oppositeUser.profileImageUrl.small || oppositeUser.profileImageUrl.raw} />
            <BlackText size="small">{oppositeUser.name || oppositeUser.userName}</BlackText>
          </Stack>
          <ClickableProfile href={profileHref} />
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
                disabled={loggedInUser.user.userId !== postOwnerId}
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
              setSelectedChatId={(chatId) => dispatch(setSelectedChatId(chatId))}
              isNewChat={isNewChat}
              setIsNewChat={(isNewChat) => dispatch(setIsNewChat(isNewChat))}
              onShow={showAppreciationMessageModal}
              onHide={handleCloseAppreciationMessageModal}
            />
            <ConfirmCompletionModal
              postType={postType}
              postId={postId}
              postEnquirerId={postEnquirerId}
              onShow={showConfirmCompletionModal}
              onClose={handleCloseConfirmCompletionModal}
              setHasError={(hasError) => dispatch(setHasError(hasError))}
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
