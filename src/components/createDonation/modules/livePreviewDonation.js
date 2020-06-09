import React from 'react';
import { Stack, Heading, Text, Alert, Tooltip, TextLink } from '@kiwicom/orbit-components/lib';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import DonationCard from '../../card/DonationCard';
import { getTitle, getDescription, getCoverImage, getLocation, getValidFrom, getValidTo } from '../selectors';
import useUser from '../../session/modules/useUser';

const Container = styled.div`
  padding: 20px;
`;

const LivePreviewDonation = () => {
  const user = useUser();
  const title = useSelector(getTitle);
  const description = useSelector(getDescription);
  const coverImage = useSelector(getCoverImage);
  const location = useSelector(getLocation);
  const validFrom = useSelector(getValidFrom);
  const validTo = useSelector(getValidTo);

  if (!user) {
    return null;
  }

  return (
    <Stack align="center" direction="column" basis="50%">
      <Container>
        <Stack spacing="extraLoose">
          <Stack>
            <Heading>Live Preview</Heading>
            <Text>This is what NPOs will see when they are searching for your post.</Text>
          </Stack>

          <Stack align="center" justify="center">
            <DonationCard
              name={user.name}
              title={title}
              description={description}
              profileImageUrl={user.profileImageUrl}
              coverImageUrl={coverImage ? coverImage.preview : ''}
              postedDateTime={Date.now()}
              postHref={''}
              locations={location}
              validPeriod={validFrom + " - " + validTo}
            />
          </Stack>
        </Stack>
      </Container>
    </Stack>
  );
};

export default LivePreviewDonation;
