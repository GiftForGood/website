import React from 'react';
import styled from 'styled-components';
import { Heading, Stack } from '@kiwicom/orbit-components/lib';
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
  display: flex;
  flex-direction: column;
  padding: 0 50px;
  margin-top: 0;
  margin-bottom: 0;
  width: auto;
`;

const Faq = () => {
  return (
    <FaqContainer>
      <Heading type="title1" spaceAfter="largest">
        Topics
      </Heading>
      <Stack direction="column">
        <GeneralTopic />
        <RegisteringTopic />
        <PostingTopic />
        <DeliveryTopic />
        <ChatTopic />
        <ProfileTopic />
        <ReportingTopic />
      </Stack>
    </FaqContainer>
  );
};

export default Faq;
