import React, { useContext } from 'react';
import { Stack, Heading, Text } from '@kiwicom/orbit-components/lib';
import styled from 'styled-components';
import WishCard from '../../card/WishCard';
import { getTitle, getDescription, getCategories, getPostedDateTime } from '../selectors';
import useUser from '../../session/modules/useUser';
import WishContext from '../context';

const Container = styled.div`
  padding: 20px;
`;

const LivePreviewPanel = () => {
  const { state } = useContext(WishContext);
  const title = getTitle(state);
  const description = getDescription(state);
  const categories = getCategories(state);
  const postedDateTime = getPostedDateTime(state);
  const user = useUser();

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
              profileHref={profileHref}
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
