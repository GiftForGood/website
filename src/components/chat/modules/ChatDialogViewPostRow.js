import React from 'react';
import { Button, Text, Grid, Stack } from '@kiwicom/orbit-components/lib';
import BlackText from '../../text/BlackText';
import api from '../../../../utils/api';
import styled, { css } from 'styled-components';
import { donations, wishes } from '../../../../utils/constants/postType';
import { CardSection } from '@kiwicom/orbit-components/lib/Card';
import SeePostButton from '../../../components/buttons/ChatSeePostButton';

const TextContainer = styled.div`
  width: fit-content;
`;

/**
 *
 * @param {string} postType is the type of the post
 * @param {string} postId is the id of the post
 */
const ChatDialogViewPostRow = ({ postType, postId, postTitle }) => {
  const handleSeePost = () => console.log('see post');
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
            <BlackText size="tiny" weight="bold">
              *Delivery cost will be covered by donor
            </BlackText>
          </Stack>
        </TextContainer>
        <Button size="small" onClick={handleSeePost} asComponent={SeePostButton}>
          See Post
        </Button>
      </Stack>
    </CardSection>
  );
};

export default ChatDialogViewPostRow;
