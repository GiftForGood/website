import React from 'react';
import Section from './Section';
import styled from 'styled-components';
import { colors } from '@constants/colors';
import { Stack, Heading, Text } from '@kiwicom/orbit-components/lib';
import Image from 'next/image';
import { stats } from '@constants/onboarding';

const ImageTextContainer = styled.div`
  max-width: 300px;
  min-width: 250px;
  width: 100%;
  display: flex;
`;

const StatsContent = ({ src, title, description }) => {
  return (
    <ImageTextContainer>
      <Stack inline direction="column" justify="center" align="center">
        <Image height="200px" width="200px" src={src} />
        <Heading as="h1" type="display">
          {title}
        </Heading>
        <Text align="center">{description}</Text>
      </Stack>
    </ImageTextContainer>
  );
};

const Background = styled.div`
  background-color: ${colors.paleGrey};
`;
const Stats = () => {
  return (
    <Background>
      <Section>
        <Stack direction="column" align="center">
          <Stack
            desktop={{
              direction: 'row',
              align: 'start',
            }}
            tablet={{
              direction: 'row',
              align: 'start',
            }}
            direction="column"
            align="center"
            justify="center"
          >
            {stats.map((stat, index) => (
              <StatsContent key={index} src={stat.src} title={stat.title} description={stat.description} />
            ))}
          </Stack>
        </Stack>
      </Section>
    </Background>
  );
};

export default Stats;
