import React from 'react';
import Avatar from '../imageContainers/Avatar';
import KiwicomGuarantee from '@kiwicom/orbit-components/lib/icons/KiwicomGuarantee';
import RatingStars from '@kiwicom/orbit-components/lib/RatingStars';
import styled from 'styled-components';
import { colors } from '../../../utils/constants/colors';
import { Stack, Text, TextLink } from '@kiwicom/orbit-components/lib';
import { CardSection } from '@kiwicom/orbit-components/lib/Card';

const CheckProfileLink = styled.a`
  color: ${colors.npoBackground};

  :link {
    color: ${colors.npoBackground};
    text-decoration: none;
  }

  :visited {
    color: ${colors.npoBackground};
  }

  :active {
    color: ${colors.npoHoverActive};
    text-decoration: underline;
  }

  :hover {
    color: ${colors.npoHoverActive};
    text-decoration: underline;
  }
`;

const CardContainer = styled.div`
  border-radius: 5px;
  box-shadow: 0px 0px 5px 0px rgba(37, 42, 49, 0.16), 0px 2px 8px 0px rgba(37, 42, 49, 0.12);
`;

const UserInfoCard = ({ postType, postUserId, postUserName, profileImageUrl, orgName }) => {
  const isWishPost = postType === 'wish';

  const HeaderInformation = () => {
    return (
      <Stack direction="row" inline spacing="natural" align="center" spaceAfter="normal">
        <Text>{isWishPost ? 'NPO Information' : 'Donor Information'}</Text>
        {isWishPost && (
          <Stack direction="row" inline spacing="extraTight" align="center">
            <KiwicomGuarantee customColor={colors.verifiedIconBackground} />
            <Text size="small">Verified NPO</Text>
          </Stack>
        )}
      </Stack>
    );
  };

  const UserInformation = () => {
    return (
      <Stack direction="column" shrink spacing="none">
        <Text>{postUserName}</Text>
        <Stack spaceAfter="large"> {isWishPost ? <Text>{orgName}</Text> : null}</Stack>
        <TextLink transparent asComponent={CheckProfileLink} href={`/profile/${postUserId}`}>
          Check Profile
        </TextLink>
      </Stack>
    );
  };

  const AvatarDetails = () => {
    return (
      <Stack direction="column" shrink inline align="center" spacing="extraTight">
        <Avatar type="large" imageUrl={profileImageUrl} />
        <RatingStars rating={3.5} size="small" color="attention" showEmpty />
      </Stack>
    );
  };

  return (
    <CardContainer>
      <CardSection>
        <HeaderInformation />
        <Stack direction="row">
          <Stack direction="row" justify="between" align="center">
            <UserInformation />
            <AvatarDetails />
          </Stack>
        </Stack>
      </CardSection>
    </CardContainer>
  );
};

export default UserInfoCard;
