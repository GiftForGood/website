import React from 'react';
import styled from 'styled-components';

// components
import { Heading, Stack, TextLink } from '@kiwicom/orbit-components/lib';
import BlackText from '@components/text/BlackText';

const ImageCreditsContainer = styled.div`
  margin-bottom: 50px;
`;

const ImageCreditsContent = () => {
  return (
    <Stack>
      <BlackText>
        <TextLink external href="https://unsplash.com/photos/geRpPjIiu8U">
          Registration Background
        </TextLink>{' '}
        image by{' '}
        <TextLink external href="https://unsplash.com/@jacalynbeales">
          Jacalyn Beales
        </TextLink>{' '}
        on{' '}
        <TextLink external href="https://unsplash.com">
          Unsplash
        </TextLink>
      </BlackText>
      <BlackText>
        <TextLink external href="https://unsplash.com/photos/4le7k9XVYjE">
          About Us Background
        </TextLink>{' '}
        image by{' '}
        <TextLink external href="https://unsplash.com/@kellysikkema">
          Kelly Sikkema
        </TextLink>{' '}
        on{' '}
        <TextLink external href="https://unsplash.com">
          Unsplash
        </TextLink>
      </BlackText>
    </Stack>
  );
};

const ImageCredits = () => {
  return (
    <ImageCreditsContainer>
      <Heading spaceAfter="largest">Images</Heading>
      <ImageCreditsContent />
    </ImageCreditsContainer>
  );
};

export default ImageCredits;
