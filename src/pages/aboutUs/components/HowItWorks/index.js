import React, { useState } from 'react';
import Section from '../Section';
import { Stack, Heading, ButtonLink, Text } from '@kiwicom/orbit-components/lib';
import Image from 'next/image';
import styled from 'styled-components';
import Linkify from 'react-linkify';
import { onboardingDonor, onboardingNpo } from '@constants/onboarding';

const ImageTextContainer = styled.div`
  max-width: 300px;
  min-width: 250px;
`;

const HowItWorksContent = ({ src, description }) => {
  return (
    <ImageTextContainer>
      <Stack inline direction='column' justify='center' align='center'>
        <Image height='200px' width='200px' src={src} />

        <Linkify
          componentDecorator={(decoratedHref, decoratedText, key) => (
            <a target='blank' href={decoratedHref} key={key}>
              {decoratedText}
            </a>
          )}
        >
          <Text align='center'>{description}</Text>
        </Linkify>
      </Stack>
    </ImageTextContainer>
  );
};

const HowItWorks = () => {
  const [activeTab, setActiveTab] = useState('donor');

  const setAsDonor = () => setActiveTab('donor');

  const setAsNpo = () => setActiveTab('npo');

  return (
    <Section>
      <Stack direction='column' align='center'>
        <Heading>How it works</Heading>

        <Stack direction='row' justify='center' spacing='small'>
          <ButtonLink onClick={setAsDonor} type={activeTab === 'donor' ? 'primary' : 'secondary'}>
            As a donor
          </ButtonLink>

          <ButtonLink onClick={setAsNpo} type={activeTab === 'npo' ? 'primary' : 'secondary'}>
            As a NPO
          </ButtonLink>
        </Stack>

        <Stack
          desktop={{
            direction: 'row',
            align: 'start',
          }}
          tablet={{
            direction: 'row',
            align: 'start',
          }}
          direction='column'
          align='center'
          justify='center'
        >
          {activeTab === 'donor'
            ? onboardingDonor.map((content, index) => (
              <HowItWorksContent key={index} src={content.src} description={content.description} />
            ))
            : null}

          {activeTab === 'npo'
            ? onboardingNpo.map((content, index) => (
              <HowItWorksContent key={index} src={content.src} description={content.description} />
            ))
            : null}
        </Stack>
      </Stack>
    </Section>
  );
};

export default HowItWorks;
