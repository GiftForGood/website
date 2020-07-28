import React from 'react';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';
import styled, { css } from 'styled-components';
import { Badge, Stack, Text, Heading } from '@kiwicom/orbit-components/lib';
import WishInformationHeader from '../../postDetails/PostDetailsHeader';
import { wishes } from '../../../../utils/constants/postType';

const WishInformationBodyContainer = styled.div`
  min-height: 100px;
  ${media.desktop(css`
    min-height: 250px;
  `)};
`;

const BadgeWrapper = styled.div`
  margin-bottom: 8px !important;
`;

const TitleTextContainer = styled.div`
  word-break: break-word;
`;

const DescriptionTextContainer = styled.div`
  word-break: break-word;
`;

const WishInformation = ({
  loginUserId,
  loginUserType,
  wishUserId,
  wishUserName,
  profileImageUrl,
  npoOrgName,
  wishId,
  title,
  description,
  status,
  categoryTags,
}) => {
  const CategoryTags = () => {
    return categoryTags.map((category) => {
      return (
        <BadgeWrapper key={category}>
          <Badge>{category}</Badge>
        </BadgeWrapper>
      );
    });
  };

  const WishInformationBody = () => {
    return (
      <WishInformationBodyContainer>
        <Stack direction="column" spacing="loose">
          <Stack>
            <TitleTextContainer>
              <Heading type="title2">{title}</Heading>
            </TitleTextContainer>
            <DescriptionTextContainer>
              <Text>{description}</Text>
            </DescriptionTextContainer>
          </Stack>
          <Stack direction="row" wrap="true">
            <CategoryTags />
          </Stack>
        </Stack>
      </WishInformationBodyContainer>
    );
  };

  return (
    <Stack spaceAfter="largest">
      <WishInformationHeader
        loginUserId={loginUserId}
        loginUserType={loginUserType}
        postUserId={wishUserId}
        postUserName={wishUserName}
        profileImageUrl={profileImageUrl}
        npoOrgName={npoOrgName}
        postId={wishId}
        postStatus={status}
        postType={wishes}
      />
      <WishInformationBody />
    </Stack>
  );
};

export default WishInformation;
