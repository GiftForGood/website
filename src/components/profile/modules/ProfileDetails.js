import React from 'react';
import ProfileAvatar from '../../imageContainers/ProfileAvatar';
import KiwicomGuarantee from '@kiwicom/orbit-components/lib/icons/KiwicomGuarantee';
import { Stack, Text, Heading } from '@kiwicom/orbit-components/lib';
import { colors } from '@constants/colors';
import { npo } from '@constants/userType';

const ProfileDetails = ({
  profileImageUrl,
  npoOrgName,
  npoOrgAddress,
  isNpoVerifiedByAdmin,
  npoContact,
  name,
  userType,
}) => {
  const isNpo = userType === npo;
  return (
    <Stack direction="column" justify="center">
      <ProfileAvatar imageUrl={profileImageUrl.small || profileImageUrl.raw} height={120} width={120} />
      <Stack direction="column" spacing="tight" justify="start">
        <Heading type="title2">{name}</Heading>
        {isNpo && <Text weight="bold">{npoOrgName}</Text>}
        {isNpoVerifiedByAdmin && (
          <Stack direction="row" inline spacing="extraTight" align="center">
            <Text size="small">Verified NPO</Text>
            <KiwicomGuarantee customColor={colors.verifiedIcon.background} />
          </Stack>
        )}
      </Stack>
      {isNpo && <Text>{npoOrgAddress}</Text>}
      {isNpo && <Text>{npoContact}</Text>}
    </Stack>
  );
};

export default ProfileDetails;
