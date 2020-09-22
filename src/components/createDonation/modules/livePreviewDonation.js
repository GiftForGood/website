import React, { useContext } from 'react';
import { Stack, Heading, Text } from '@kiwicom/orbit-components/lib';
import styled from 'styled-components';
import DonationCard from '../../card/DonationCard';
import { getTitle, getDescription, getCoverImage, getItemCondition, getValidFrom, getValidTo } from '../selectors';
import useUser from '../../session/modules/useUser';
import DonationContext from '../context';

const Container = styled.div`
  padding: 20px;
`;

const LivePreviewDonation = () => {
  const { state } = useContext(DonationContext);
  const user = useUser();
  const title = getTitle(state);
  const description = getDescription(state);
  const coverImage = getCoverImage(state);
  const itemCondition = getItemCondition(state);
  const validFrom = getValidFrom(state);
  const validTo = getValidTo(state);

  if (!user) {
    return null;
  }

  const profileHref = `/profile/${user.userId}`;

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
              profileHref={profileHref}
              itemCondition={itemCondition}
              validPeriod={validFrom + ' - ' + validTo}
            />
          </Stack>
        </Stack>
      </Container>
    </Stack>
  );
};

export default LivePreviewDonation;
