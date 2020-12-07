import React from 'react';
import CoverPhoto from '../modules/CoverPhoto';
import { MaxWidthContainer } from '@components/containers';
import styled, { css } from 'styled-components';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';
import ProfilePhoto from '../modules/ProfilePhoto';
import { Stack, Heading, Button, Text } from '@kiwicom/orbit-components/lib';

const CoverPhotoContainer = styled(MaxWidthContainer)`
  margin-top: 0;
  width: 100vw;
`;

const ProfilePhotoContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 50%;
  margin-bottom: 20px;
  transform: translateX(-55%);
`;

const OrganizationalPage = ({ organization, isMine }) => {
  return (
    <div>
      <CoverPhotoContainer>
        <CoverPhoto
          showEdit={true}
          src={organization.coverPhotoUrl}
        >
          <ProfilePhotoContainer>
            <ProfilePhoto
              src={organization.profileImageUrl?.raw}
              showEdit={true}
            />
          </ProfilePhotoContainer>
        </CoverPhoto>
      </CoverPhotoContainer>

      <MaxWidthContainer>
        <Stack>
          <Stack justify="center">
            <Heading as="h1" type="title2">
              {organization.name}
            </Heading>
          </Stack>

          <Stack direction="row" justify="between">
            <Stack inline grow align="center">
              <Heading type="displaySubtitle">About Us</Heading>
            </Stack>

            {isMine ? (
              <Stack direction="row" inline justify="end">
                <Button size="small">Edit</Button>
                <Button size="small">See history</Button>
              </Stack>
            ) : null}
          </Stack>

          <Text>{organization.description}</Text>
        </Stack>
      </MaxWidthContainer>
    </div>
  );
};

export default OrganizationalPage;
