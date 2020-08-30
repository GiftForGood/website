import React, { useState, useEffect, useContext } from 'react';
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
import { donations } from '../../../../utils/constants/postType';
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

  const { state, dispatch } = useContext(ChatContext);
  const loggedInUser = getUser(state);
  const isNewChat = getIsNewChat(state);
  const selectedChatId = getSelectedChatId(state);

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
