import React from 'react';
import styled from 'styled-components';

// components
import { Button, Stack } from '@kiwicom/orbit-components/lib';
import BlackText from '@components/text/BlackText';
import { CardSection } from '@kiwicom/orbit-components/lib/Card';
import SeePostButton from '@components/buttons/ChatSeePostButton';

// constants and utils
import { donations, wishes } from '@constants/postType';
import router from 'next/router';

const TextContainer = styled.div`
  width: fit-content;
`;

const ClickablePost = styled.a`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
`;

/**
 *
 * @param {string} postType is the type of the post
 * @param {string} postId is the id of the post
 * @param {string} postTitle is the title of the post
 */
const ChatDialogViewPostRow = ({ postType, postId, postTitle }) => {
  const postHref = `/${postType}/${postId}`;
  const handleSeePost = (event) => {
    event.preventDefault();
    router.push(postHref);
  };

  return (
    <CardSection>
      <Stack direction="row" justify="between" align="center">
        <TextContainer>
          <Stack direction="column" align="start" spacing="extraTight">
            <BlackText size="small">
              {postType === donations ? 'Donating:' : postType === wishes ? 'Requesting for:' : 'N.A.'}
            </BlackText>
            <BlackText size="small" weight="bold">
              {postTitle}
            </BlackText>
          </Stack>
        </TextContainer>
        <Button size="small" onClick={handleSeePost} asComponent={SeePostButton}>
          {postType === donations ? 'View Donation' : 'View Wish'}
        </Button>
      </Stack>
      <ClickablePost href={postHref} />
    </CardSection>
  );
};

export default ChatDialogViewPostRow;
