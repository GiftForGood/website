import React, { useState } from 'react';
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
              postType={postType}
              postId={postId}
              selectedChatId={selectedChatId}
              setSelectedChatId={setSelectedChatId}
              isNewChat={isNewChat}
              setIsNewChat={setIsNewChat}
              onShow={showSuggestDateModal}
              onHide={handleCloseSuggestDateModal}
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
