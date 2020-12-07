import React from 'react';
import styled from 'styled-components';
import { Heading } from '@kiwicom/orbit-components/lib';
import { colors } from '@constants/colors';

const BannerContainer = styled.div`
  position: relative;
  width: 100vw;
  margin-bottom: 30px;
`;

const BannerBackgroundContainer = styled.div`
  height: 100%;
  min-height: 300px;
  position: relative;
  background: ${colors.primaryTeal.background};
  background-size: cover;
  background-position: 50% 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 50px;
`;

const BannerTextContainer = styled.div`
  width: 100%;
  max-width: 1280px;
`;

const Banner = () => {
  return (
    <BannerContainer>
      <BannerBackgroundContainer>
        <BannerTextContainer>
          <Heading as="h1" type="display" inverted spaceAfter="medium">
            Hello there!
          </Heading>
          <Heading as="h1" type="display" inverted spaceAfter="medium">
            How can we help you?
          </Heading>
        </BannerTextContainer>
      </BannerBackgroundContainer>
    </BannerContainer>
  );
};

export default Banner;
