import React from 'react';
import ProfileAvatar from '../../imageContainers/ProfileAvatar';
import RatingStars from '../../ratingStars';
import { Stack, Text, Heading } from '@kiwicom/orbit-components/lib';
import { npo } from '../../../../utils/constants/userType';
import { colors } from '../../../../utils/constants/colors';

const ProfileDetails = ({ profileImageUrl, npoOrgName, userRating, npoOrgAddress, npoContact, name, userType }) => {
  const isNpo = userType === npo;
  return (
    <Stack direction="column" justify="center">
      <ProfileAvatar imageUrl={profileImageUrl} height={120} width={120} />
      <Stack direction="column" spacing="tight" justify="start">
        <Heading type="title2">{name}</Heading>
        <Text weight="bold">{npoOrgName}</Text>
        <RatingStars rating={userRating} size="small" color={colors.ratingStarBackground} showEmpty />
        {isNpo && <Text>{npoOrgAddress}</Text>}
      </Stack>
      {isNpo && <Text>{npoContact}</Text>}
    </Stack>
  );
};

export default ProfileDetails;
