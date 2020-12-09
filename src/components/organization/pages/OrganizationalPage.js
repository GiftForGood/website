import React, { useState } from 'react';
import CoverPhoto from '../modules/CoverPhoto';
import { MaxWidthContainer } from '@components/containers';
import styled, { css } from 'styled-components';
import ProfilePhoto from '../modules/ProfilePhoto';
import { Stack, Heading, Button, Text, Textarea } from '@kiwicom/orbit-components/lib';
import OrganizationWishes from '../modules/OrganizationWishes';
import api from '@api';
import { useRouter } from 'next/router';
import HistoryModal from '../modules/HistoryModal';

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
  const [updatedDescription, setUpdatedDescription] = useState('');
  const router = useRouter();
  const [isOpenHistory, setIsOpenHistory] = useState(false);

  const saveDescription = () => {
    if (updatedDescription) {
      setIsEditing(false);
      api.npoOrganization.update(organization.id, updatedDescription, '', '').then(() => {
        router.reload();
      });
    }
  };

  const saveProfileImage = (file) => {
    if (file) {
      api.npoOrganization
        .update(organization.id, organization.description ? organization.description : '', '', file)
        .then(() => {
          router.reload();
        });
    }
  };

  const saveCoverImage = (file) => {
    if (file) {
      api.npoOrganization
        .update(organization.id, organization.description ? organization.description : '', file, '')
        .then(() => {
          router.reload();
        });
    }
  };

  const closeHistoryModal = () => setIsOpenHistory(false);

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

                <Button size="small" onClick={() => setIsOpenHistory(true)}>
                  See history
                </Button>
              </Stack>
            ) : null}
          </Stack>

          {isEditing ? (
            <Textarea
              onChange={(event) => {
                setUpdatedDescription(event.target.value);
              }}
              placeholder="Your organization description"
              value={updatedDescription}
            />
          ) : (
            <Text>{organization.description ? organization.description : 'No description'}</Text>
          )}

          <OrganizationWishes organization={organization} />
        </Stack>

        {isOpenHistory ? <HistoryModal onClose={closeHistoryModal} organization={organization} /> : null}
      </ContentContainer>
    </div>
  );
};

export default OrganizationalPage;
