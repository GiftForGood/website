import React, { useState } from 'react';
import Avatar from '../imageContainers/Avatar';
import ReportPostModal from '../modal/ReportPostModal';
import ClosePostModal from '../modal/ClosePostModal';
import SharePostModal from '../modal/SharePostModal';
import ChatButton from '../buttons/ChatButton';
import useMediaQuery from '@kiwicom/orbit-components/lib/hooks/useMediaQuery';
import Verified from '../session/modules/Verified';
import { AlertCircle, Edit, CloseCircle, MenuKebab, ShareAndroid } from '@kiwicom/orbit-components/lib/icons';
import { Button, Stack, Text, Popover, ButtonLink } from '@kiwicom/orbit-components/lib';
import { useRouter } from 'next/router';
import { wishes } from '../../../utils/constants/postType';

const PostDetailsHeader = ({
  loginUserId,
  postUserId,
  postUserName,
  profileImageUrl,
  npoOrgName,
  postId,
  postStatus,
  postType,
}) => {
  const router = useRouter();
  const isOwnPost = loginUserId === postUserId; // whether login user is the post owner
  const chatType = isOwnPost ? 'View Chats' : 'Chat';
  const postUrl = `https://www.giftforgood.io/${postType}/${postId}`;

  const { isLargeMobile } = useMediaQuery();
  const [isClosedPost, setIsClosedPost] = useState(postStatus === 'closed');
  const [showReportPostModal, setShowPostPostModal] = useState(false);
  const [showClosePostModal, setShowClosePostModal] = useState(false);
  const [showSharePostModal, setShowSharePostModal] = useState(false);

  const handleReportPostModal = () => {
    if (showReportPostModal) {
      setShowPostPostModal(false);
    } else {
      setShowPostPostModal(true);
    }
  };

  const handleClosePostModal = () => {
    if (showClosePostModal) {
      setShowClosePostModal(false);
    } else {
      setShowClosePostModal(true);
    }
  };

  const handleSharePostModal = () => {
    if (showSharePostModal) {
      setShowSharePostModal(false);
    } else {
      setShowSharePostModal(true);
    }
  };

  const handleOnClickChatBtn = (event) => {
    event.preventDefault();
    router.push(chatType === 'Chat' ? `/chat/${postId}` : `/viewChat/${postId}`);
  };

  const handleOnClickShareBtn = () => {
    // Sharing for mobile, safari desktop browser on https
    if (navigator.share) {
      navigator
        .share({
          text: `Check out this ${postType === wishes ? 'wish' : 'donation'} from GiftForGood! \n${postUrl}`,
        })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    } else {
      // For those that do not support navigator.share, e.g. Chrome desktop browser
      handleSharePostModal();
    }
  };

  const PopoverContent = ({ isDisabled }) => {
    const editPostHref = `/edit/${postType}/${postId}`;
    return (
      <>
        {showReportPostModal ? (
          <ReportPostModal
            postId={postId}
            postType={postType}
            loginUserId={loginUserId}
            onClose={handleReportPostModal}
          />
        ) : null}
        {showClosePostModal ? (
          <ClosePostModal
            postId={postId}
            postType={postType}
            onClose={handleClosePostModal}
            setIsClosedPost={setIsClosedPost}
          />
        ) : null}
        <Popover
          content={
            <Stack>
              {isOwnPost ? (
                <Stack direction="column" spacing="extraTight">
                  <ButtonLink
                    transparent
                    type="secondary"
                    iconLeft={<Edit />}
                    href={editPostHref}
                    fullWidth={!isLargeMobile}
                    disabled={isDisabled || isClosedPost}
                  >
                    Edit post
                  </ButtonLink>
                  <ButtonLink
                    transparent
                    type="secondary"
                    iconLeft={<CloseCircle />}
                    fullWidth={!isLargeMobile}
                    onClick={handleClosePostModal}
                    disabled={isDisabled || isClosedPost}
                  >
                    Mark as closed
                  </ButtonLink>
                </Stack>
              ) : (
                <ButtonLink
                  transparent
                  type="secondary"
                  iconLeft={<AlertCircle />}
                  onClick={handleReportPostModal}
                  fullWidth={!isLargeMobile}
                  disabled={isDisabled || isClosedPost}
                >
                  Report post
                </ButtonLink>
              )}
            </Stack>
          }
          preferredAlign="end"
        >
          <Button size="small" type="secondary" iconLeft={<MenuKebab />}></Button>
        </Popover>
      </>
    );
  };

  const AvatarDetails = () => {
    return (
      <Stack align="center" direction="row" spacing="condensed" shrink>
        <Avatar imageUrl={profileImageUrl} />
        <Stack direction="column" shrink spacing="none">
          <Text>{postUserName}</Text>
          <Text>{npoOrgName}</Text>
        </Stack>
      </Stack>
    );
  };

  const Buttons = () => {
    return (
      <Stack align="center" inline justify="center" spacing="condensed">
        <Verified>
          {({ isDisabled }) => {
            return (
              <>
                <Button
                  disabled={isDisabled}
                  size="small"
                  asComponent={ChatButton}
                  onClick={handleOnClickChatBtn}
                  width="150px"
                >
                  {chatType}
                </Button>
                {showSharePostModal ? (
                  <SharePostModal
                    postId={postId}
                    postUrl={postUrl}
                    postType={postType}
                    onClose={handleSharePostModal}
                  />
                ) : null}
                <Button
                  size="small"
                  type="secondary"
                  iconLeft={<ShareAndroid />}
                  onClick={handleOnClickShareBtn}
                ></Button>
                <PopoverContent isDisabled={isDisabled} />
              </>
            );
          }}
        </Verified>
      </Stack>
    );
  };

  return (
    <Stack largeDesktop={{ align: 'center', direction: 'row', justify: 'between', shrink: true }} direction="column">
      <AvatarDetails />
      <Buttons />
    </Stack>
  );
};

export default PostDetailsHeader;
