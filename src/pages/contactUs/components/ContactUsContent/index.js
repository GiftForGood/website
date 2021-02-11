import React from 'react';
import styled from 'styled-components';

// components
import { Heading, Text, TextLink } from '@kiwicom/orbit-components/lib';
import { contactUsGoogleFormPath } from '@constants/googleFormPaths';
import { MaxWidthContainer } from '@components/containers';

const TitleContainer = styled.div`
  margin-bottom: 50px;
`;

const MainContainer = styled(MaxWidthContainer)`
  padding: 0 10px;
`;

const ContactUsContainer = styled.div`
  margin-bottom: 50px;
`;

const FeedbackContainer = styled.div`
  margin-bottom: 50px;
`;

const ContactUsContent = () => {
  return (
    <MainContainer>
      <TitleContainer>
        <Heading as="h1" type="display">
          Get in touch with
        </Heading>
        <Heading as="h1" type="display">
          GiftforGood
        </Heading>
      </TitleContainer>
      <ContactUsContainer>
        <Text size="large" weight="bold" spaceAfter="normal">
          Contact us @
        </Text>
        <Text size="large">
          <TextLink size="large" href="mailto: support@giftforgood.io">
            support@giftforgood.io
          </TextLink>{' '}
          (for tech enquiries) or{' '}
          <TextLink size="large" href="mailto: hello@giftforgood.io">
            hello@giftforgood.io
          </TextLink>{' '}
          (for all other enquiries)
        </Text>
      </ContactUsContainer>
      <FeedbackContainer>
        <Text size="large" weight="bold" spaceAfter="normal">
          Send us your feedback
        </Text>
        <Text size="large">
          If you have a query, feedback or wish to report a problem related to GiftforGood, please fill in the{' '}
          <TextLink external href={contactUsGoogleFormPath}>
            online form
          </TextLink>
        </Text>
      </FeedbackContainer>
    </MainContainer>
  );
};

export default ContactUsContent;
