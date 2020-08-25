import React from 'react';
import styled, { css } from 'styled-components';
import { Heading, Text } from '@kiwicom/orbit-components/lib';
import WhiteText from '../../text/WhiteText';
import media from '@kiwicom/orbit-components/lib/utils/mediaQuery';

const BannerContainer = styled.div`
  position: relative;
  width: 100vw;
  margin-bottom: 30px;
`;

const BannerImageContainer = styled.div`
  height: 100%;
  min-height: 300px;
  position: relative;
  background: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${(props) => props.src});
  background-size: cover;
  background-position: 50% 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 50px;
`;

const BannerTextContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
`;

const Banner = () => {
  return (
    <BannerContainer>
      <BannerImageContainer src="https://res.cloudinary.com/giftforgood/image/upload/v1598075642/banners/DUMMY_baaocm.png">
        <BannerTextContainer>
          <Heading as="h1" type="display" inverted spaceAfter="medium">
            Welcome to the GiftforGood!
          </Heading>
          <WhiteText size="large">
            GiftforGood is a simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
            industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and
            scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into
            electronic typesetting, remaining essentially unchanged.
          </WhiteText>
        </BannerTextContainer>
      </BannerImageContainer>
    </BannerContainer>
  );
};

export default Banner;
