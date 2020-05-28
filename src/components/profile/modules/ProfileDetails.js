import React from 'react';
import Avatar from '../../imageContainers/Avatar';
import RatingStars from '../../ratingStars';
import { Stack, Text } from '@kiwicom/orbit-components/lib';
import { npo } from '../../../../utils/constants/userType';
import { colors } from '../../../../utils/constants/colors';

const ProfileDetails = ({ profileImageUrl, npoOrgName, userRating, npoOrgAddress, npoContact, userType }) => {
  const isNpo = userType === npo;
  return (
    <Stack direction="column" justify="center">
      <Avatar size="120px" imageUrl={profileImageUrl} />
      <Stack direction="column" spacing="tight" justif="start">
        <Text weight="bold">{npoOrgName}</Text>
        <RatingStars rating={userRating} size="small" color={colors.ratingStarBackground} showEmpty />
        {isNpo && <Text>{npoOrgAddress}</Text>}
      </Stack>
      {isNpo && <Text>{npoContact}</Text>}
    </Stack>
  );
};

export default ProfileDetails;
