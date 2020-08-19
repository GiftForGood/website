import React, { useState, useEffect } from 'react';
import { Button, Stack } from '@kiwicom/orbit-components/lib';
import AppreciationMessageModal from '../../modal/AppreciationMessageModal';
import ConfirmCompletionModal from '../../modal/ConfirmCompletionModal';
import ProfileAvatar from '../../imageContainers/ProfileAvatar';
import BlackText from '../../text/BlackText';
import CompleteButton from '../../../components/buttons/ChatCompleteButton';
import styled from 'styled-components';
import { CardSection } from '@kiwicom/orbit-components/lib/Card';
import { PENDING, COMPLETED } from '../../../../utils/constants/postStatus';
import StatusTag from '../../../components/tags/StatusTag';

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
}) => {
  const [showAppreciationMessageModal, setShowAppreciationMessageModal] = useState(false);
  const [showConfirmCompletionModal, setShowConfirmCompletionModal] = useState(false);
  const [status, setStatus] = useState(postStatus);

  const handleCloseAppreciationMessageModal = () => setShowAppreciationMessageModal(false);
  const handleShowAppreciationMessageModal = () => setShowAppreciationMessageModal(true);
  const handleCloseConfirmCompletionModal = () => setShowConfirmCompletionModal(false);
  const handleSetStatusToComplete = () => setStatus(COMPLETED);

  const handleCompletePost = () => {
    setShowConfirmCompletionModal(true);
  };

  // set status state based on the changes in passed input parameter postStatus
  useEffect(() => {
    setStatus(postStatus);
  }, [postStatus]);

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
