import React from 'react';
import styled, { css } from 'styled-components';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';

// components
import { Heading, Stack, TextLink } from '@kiwicom/orbit-components/lib';
import {
  Banner,
  TopicChat,
  TopicDelivery,
  TopicGeneral,
  TopicPosting,
  TopicProfile,
  TopicRegistering,
  TopicReporting,
} from './components';
import { MaxWidthContainer } from '@components/containers';

const FaqContainer = styled(MaxWidthContainer)`
  position: relative;
  padding: 0 20px;

  ${media.desktop(css`
    padding: 0 50px;
  `)}
`;

const Faq = () => {
  return (
    <>
      <Banner />
      <FaqContainer>
        <Heading type="title1" spaceAfter="largest">
          Topics
        </Heading>
        <Stack direction="column" spaceAfter="largest">
          <TopicGeneral />
          <TopicRegistering />
          <TopicPosting />
          <TopicDelivery />
          <TopicChat />
          <TopicProfile />
          <TopicReporting />
        </Stack>
        <Heading type="title1" spaceAfter="large">
          Do you have any other questions?
        </Heading>
        <TextLink size="large" href="mailto: hello@giftforgood.io">
          Contact Us
        </TextLink>
      </FaqContainer>
    </>
  );
};

export default Faq;
