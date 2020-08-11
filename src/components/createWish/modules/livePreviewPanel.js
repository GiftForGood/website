import React from 'react';
import { Stack, Heading, Text, Alert, Tooltip, TextLink } from '@kiwicom/orbit-components/lib';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import WishCard from '../../card/WishCard';
import { getTitle, getDescription, getCategories, getPostedDateTime } from '../selectors';
import useUser from '../../session/modules/useUser';

const Container = styled.div`
  padding: 20px;
`;

const LivePreviewPanel = () => {
  const title = useSelector(getTitle);
  const description = useSelector(getDescription);
  const categories = useSelector(getCategories);
  const postedDateTime = useSelector(getPostedDateTime);
  const user = useUser();

  if (!user) {
    return null;
  }

  return (
    <Stack align="center" direction="column" basis="50%">
      <Container>
        <Stack spacing="extraLoose">
          <Stack>
            <Heading>Live Preview</Heading>
            <Text>This is what donors will see when they are searching for your post.</Text>
          </Stack>

          <Stack align="center" justify="center">
            <WishCard
              name={user.organization.name}
              profileImageUrl={user.profileImageUrl}
              title={title}
              description={description}
              postedDateTime={postedDateTime}
              postHref={''}
              categoryTags={categories.map((category) => category.name)}
              isBumped={false}
            />
          </Stack>
        </Stack>
      </Container>
    </Stack>
  );
};

export default LivePreviewPanel;
