import React from 'react';
import styled from 'styled-components';

// components
import { Heading } from '@kiwicom/orbit-components/lib';
import WhiteText from '@components/text/WhiteText';

const BannerContainer = styled.div`
  position: relative;
  width: 100vw;
  margin-bottom: 30px;
`;

const BannerImageContainer = styled.div`
  height: 100%;
  min-height: 300px;
  position: relative;
  background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${(props) => props.src});
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
      <BannerImageContainer src="https://res.cloudinary.com/giftforgood/image/upload/v1591517911/donations-banner.jpg">
        <BannerTextContainer>
          <Heading as="h1" type="display" inverted spaceAfter="medium">
            Welcome to the GiftforGood!
          </Heading>
          <WhiteText size="extraLarge">
            The GiftforGood team is a team from Developer Student Club NUS,that comprises of a mixture of current and
            prior NUS undergraduates. Our team's vision is to galvanise in-kind donations towards a more generous
            Singapore.
          </WhiteText>
        </BannerTextContainer>
      </BannerImageContainer>
    </BannerContainer>
  );
};

export default Banner;
