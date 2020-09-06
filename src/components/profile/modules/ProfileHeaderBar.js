import React from 'react';
import styled from 'styled-components';
import EditProfileButton from '../../buttons/EditProfileButton';
import { useRouter } from 'next/router';
import { Button, Stack, TextLink, Separator } from '@kiwicom/orbit-components/lib';
import { colors } from '@constants/colors';
import { npo } from '@constants/userType';

const HeaderBarContainer = styled.div`
  padding: 0px 25px 0px 30px;
`;

const unselectedLink = styled.a`
  color: ${colors.subtleGrey};
  text-decoration: none;

  :hover {
    color: ${colors.ratingStarBackground};
    text-decoration: underline;
  }
`;

const selectedLink = styled.a`
  color: ${colors.ratingStarBackground};
  text-decoration: underline;

  :hover {
    color: ${colors.ratingStarBackground};
    text-decoration: none;
  }
`;

const ProfileHeaderBar = ({
  profileType,
  isShowPastPosts,
  setIsShowPastPosts,
  isShowCompletedPosts,
  setIsShowCompletedPosts,
  isMine,
}) => {
  const router = useRouter();

  const handleOnClickEditProfileBtn = (event) => {
    event.preventDefault();
    router.push('/settings/profile');
  };

  return (
    <Stack>
      <Separator />
      <HeaderBarContainer>
        <Stack align="center" direction="row" justify="between" shrink>
          <Stack direction="row" spacing="comfy" shrink>
            <TextLink
              type="secondary"
              asComponent={isShowPastPosts ? selectedLink : unselectedLink}
              onClick={() => {
                setIsShowPastPosts(true);
                setIsShowCompletedPosts(false);
              }}
            >
              {profileType === npo ? 'Wishes' : 'Donations'}
            </TextLink>
            <TextLink
              type="secondary"
              asComponent={isShowCompletedPosts ? selectedLink : unselectedLink}
              onClick={() => {
                setIsShowPastPosts(false);
                setIsShowCompletedPosts(true);
              }}
            >
              {profileType === npo ? 'Completed Donations' : 'Completed Wishes'}
            </TextLink>
          </Stack>

          {isMine ? (
            <Button asComponent={EditProfileButton} size="small" onClick={handleOnClickEditProfileBtn}>
              Edit Profile
            </Button>
          ) : null}
        </Stack>
      </HeaderBarContainer>
      <Separator />
    </Stack>
  );
};

export default ProfileHeaderBar;
