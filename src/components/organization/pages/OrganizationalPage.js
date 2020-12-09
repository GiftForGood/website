import React, { useState } from 'react';
import CoverPhoto from '../modules/CoverPhoto';
import { MaxWidthContainer } from '@components/containers';
import styled, { css } from 'styled-components';
import ProfilePhoto from '../modules/ProfilePhoto';
import { Stack, Heading, Button, Text, Textarea } from '@kiwicom/orbit-components/lib';
import OrganizationWishes from '../modules/OrganizationWishes';
import api from '@api';
import { useRouter } from 'next/router';

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

const ContentContainer = styled(MaxWidthContainer)`
  margin-top: 10px;
`;

const OrganizationalPage = ({ organization, isMine }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedDesciption, setUpdatedDescription] = useState('');
  const router = useRouter();

  const saveDescription = () => {
    if (updatedDesciption) {
      setIsEditing(false);
      api.npoOrganization.update(organization.id, updatedDesciption, '', '').then(() => {
        router.reload();
      });
    }
  };

  const saveProfileImage = (file) => {
    if (file) {
      api.npoOrganization.update(organization.id, organization.description, '', file).then(() => {
        router.reload();
      });
    }
  };

  const saveCoverImage = (file) => {
    if (file) {
      api.npoOrganization.update(organization.id, organization.description, file, '').then(() => {
        router.reload();
      });
    }
  };

  return (
    <div>
      <CoverPhotoContainer>
        <CoverPhoto
          showEdit={isMine}
          src={organization.coverImageUrl?.large ? organization.coverImageUrl?.large : organization.coverImageUrl?.raw}
          onImageSelected={saveCoverImage}
        >
          <ProfilePhotoContainer>
            <ProfilePhoto
              src={
                organization.profileImageUrl?.large
                  ? organization.profileImageUrl?.large
                  : organization.profileImageUrl?.raw
              }
              showEdit={isMine}
              onImageSelected={saveProfileImage}
            />
          </ProfilePhotoContainer>
        </CoverPhoto>
      </CoverPhotoContainer>

      <ContentContainer>
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
                {isEditing ? (
                  <>
                    <Button size="small" onClick={saveDescription}>
                      Save
                    </Button>
                    <Button
                      size="small"
                      type="neutral"
                      onClick={() => {
                        setIsEditing(false);
                        setUpdatedDescription('');
                      }}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    size="small"
                    onClick={() => {
                      setIsEditing(true);
                      setUpdatedDescription(organization.description);
                    }}
                  >
                    Edit
                  </Button>
                )}

                <Button size="small">See history</Button>
              </Stack>
            ) : null}
          </Stack>

          {isEditing ? (
            <Textarea
              onChange={(event) => {
                setUpdatedDescription(event.target.value);
              }}
              placeholder="Your organization description"
              value={updatedDesciption}
            />
          ) : (
            <Text>{organization.description ? organization.description : 'No description'}</Text>
          )}

          <OrganizationWishes organization={organization} />
        </Stack>
      </ContentContainer>
    </div>
  );
};

export default OrganizationalPage;
