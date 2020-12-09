import React from 'react';
import styled, { css } from 'styled-components';
import { Heading, Stack, TextLink } from '@kiwicom/orbit-components/lib';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';
import Banner from '../modules/Banner';
import ChatTopic from '../modules/chat';
import DeliveryTopic from '../modules/delivery';
import GeneralTopic from '../modules/general';
import PostingTopic from '../modules/posting';
import ProfileTopic from '../modules/profile';
import RegisteringTopic from '../modules/registering';
import ReportingTopic from '../modules/reporting';

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
          <GeneralTopic />
          <RegisteringTopic />
          <PostingTopic />
          <DeliveryTopic />
          <ChatTopic />
          <ProfileTopic />
          <ReportingTopic />
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
