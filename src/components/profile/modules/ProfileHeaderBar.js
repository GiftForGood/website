import React from 'react';
import styled from 'styled-components';
import EditProfileButton from '../../buttons/EditProfileButton';
import { useRouter } from 'next/router';
import { Button, Stack, TextLink, Separator } from '@kiwicom/orbit-components/lib';
import { colors } from '../../../../utils/constants/colors';

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

const ProfileHeaderBar = ({ isShowPastWishes, isShowReviews, setIsShowPastWishes, setIsShowReviews, isMine }) => {
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
              asComponent={isShowPastWishes ? selectedLink : unselectedLink}
              onClick={() => {
                setIsShowReviews(false);
                setIsShowPastWishes(true);
              }}
            >
              Past Wishes
            </TextLink>
            <TextLink
              type="secondary"
              asComponent={isShowReviews ? selectedLink : unselectedLink}
              onClick={() => {
                setIsShowReviews(true);
                setIsShowPastWishes(false);
              }}
            >
              Reviews
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
