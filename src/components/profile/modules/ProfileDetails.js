import React from 'react';
import ProfileAvatar from '../../imageContainers/ProfileAvatar';
import { Stack, Text, Heading } from '@kiwicom/orbit-components/lib';
import { npo } from '@constants/userType';

const ProfileDetails = ({ profileImageUrl, npoOrgName, npoOrgAddress, npoContact, name, userType }) => {
  const isNpo = userType === npo;
  return (
    <Stack direction="column" justify="center">
      <ProfileAvatar imageUrl={profileImageUrl.small || profileImageUrl.raw} height={120} width={120} />
      <Stack direction="column" spacing="tight" justify="start">
        <Heading type="title2">{name}</Heading>
        {isNpo && <Text weight="bold">{npoOrgName}</Text>}
        {isNpo && <Text>{npoOrgAddress}</Text>}
      </Stack>
      {isNpo && <Text>{npoContact}</Text>}
    </Stack>
  );
};

export default ProfileDetails;
