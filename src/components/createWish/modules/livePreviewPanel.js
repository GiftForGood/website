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
              name={user.name}
              title={title}
              description={description}
              postedDateTime={postedDateTime}
              postHref={''}
              categoryTags={categories.map((category) => category.name)}
              isBumped={false}
            />
          </Stack>

          <Alert icon title="How long will my post stay on the platform?">
            Your wish will stay on the platform for 1 month. You can choose to{' '}
            <Tooltip
              content={
                <div>
                  Bumping will extend your post by <b>1 more week</b> and bring your wish to the top of the list
                  temporarily.
                </div>
              }
              preferredPosition="left"
            >
              <TextLink>bump</TextLink>
            </Tooltip>{' '}
            it once any time after you have posted it.
          </Alert>
        </Stack>
      </Container>
    </Stack>
  );
};

export default LivePreviewPanel;
